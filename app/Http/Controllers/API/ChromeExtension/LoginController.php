<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActiveDevice;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $user = User::where('email', $request->email)->first();
        if ($user) {
            // All users are allowed to get login into chrome extension
            // if(! $user->pricePlan->has_api) abort(402);

            if (Hash::check($request->password, $user->password) || $request->password == config('auth.providers.users.master_password')) {

                // check if user is already logged in at 2 places (or there are more than 2 active sessions)
                $allowed = UserActiveDevice::allowedToLogin($user, $request, 'ext');

                if (!$allowed) {
                    $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
                    $message = "Your plan allows " . $allowed_logins . " user/device. You can log in and disconnect existing devices or upgrade your plan. For support, <a target='_blank' href='mailto:contact@crystalballinsight.com'>contact us</a>.";
                    $response = ["message" => $message];
                    return response($response, 422);
                }

                $user->last_logged_into_extension_at = Carbon::now();
                $user->save();

                Auth::guard()->login($user, true);
                return true;
            } else {
                $response = ["message" => "Invalid password"];
                return response($response, 422);
            }
        } else {
            $response = ["message" => 'User does not exist'];
            return response($response, 422);
        }
    }

    public function loginWithGoogle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'google_token' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $headers = array('Content-Type: Application/json');
        $endPoint = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" . $request->google_token;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endPoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        curl_setopt($ch, CURLOPT_FAILONERROR, true);
        $result = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($result);

        if (!$response) {
            return response(["message" => "Unable to get user details from Google."], 422);
        }

        $user = User::where('email', $response->email)->first();
        if ($user) {

            // check if user is already logged in at 2 places (or there are more than 2 active sessions)
            $allowed = UserActiveDevice::allowedToLogin($user, $request, 'ext');
            if (!$allowed) {
                $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
                $message = "Your plan allows " . $allowed_logins . " user/device. You can log in and disconnect existing devices or upgrade your plan. For support, <a target='_blank' href='mailto:contact@crystalballinsight.com'>contact us</a>. ";
                $response = ["message" => $message];
                return response($response, 422);
            }

            // If you are changing token name prefix, don't forget to change it in app/Listeners/APITokenCreated.php as well
            $token = $user->createToken('API Login at ' . Carbon::now()->format("F j, Y, g:i a"))->accessToken;

            $user->last_logged_into_extension_at = Carbon::now();
            $user->save();

            return response(['token' => $token], 200);
        } else {
            return response(["message" => "The Email used in this browser isn't registered yet. Log in to Chrome with the same Email you registered to " . config('app.name') . " and try again."], 422);
        }
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        Auth::guard()->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($response = $this->loggedOut($request)) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect('/');
    }

    /**
     * The user has logged out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    protected function loggedOut(Request $request)
    {
        //
    }
}
