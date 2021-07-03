<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            if (Hash::check($request->password, $user->password)) {

                // If you are changing token name prefix, don't forget to change it in app/Listeners/APITokenCreated.php as well
                $token = $user->createToken('API Login at ' . Carbon::now()->format("F j, Y, g:i a"))->accessToken;

                $user->last_logged_into_extension_at = Carbon::now();
                $user->save();

                $response = ['token' => $token];
                return response($response, 200);
            } else {
                $response = ["message" => "Password mismatch"];
                return response($response, 422);
            }
        } else {
            $response = ["message" => 'User does not exist'];
            return response($response, 422);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
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
            // If you are changing token name prefix, don't forget to change it in app/Listeners/APITokenCreated.php as well
            $token = $user->createToken('API Login at ' . Carbon::now()->format("F j, Y, g:i a"))->accessToken;

            $user->last_logged_into_extension_at = Carbon::now();
            $user->save();

            return response(['token' => $token], 200);
        } else {
            return response(["message" => "The Email used in this browser isn't registered yet. Log in to Chrome with the same Email you registered to GAannotations and try again."], 422);
        }
    }

}
