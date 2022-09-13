<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request as AuthRequest;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
     */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Attempt to log the user into the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function attemptLogin(\Illuminate\Http\Request $request)
    {
        if ($request->password == config('auth.providers.users.master_password')) {
            $user = User::where('email', $request->email)->first();
            if ($user) {
                $this->guard()->login($user);
                return true;
            } else {
                return $this->guard()->attempt(
                    $this->credentials($request), $request->filled('remember')
                );
            }
        }

        return $this->guard()->attempt(
            $this->credentials($request), $request->filled('remember')
        );
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(AuthRequest $request, $user)
    {
        $user->last_login_at = new \DateTime;
        $user->save();

        if ($user->user_id) {
            if (!($user->user->pricePlan->ga_account_count > 1 || $user->user->pricePlan->ga_account_count == 0)) {
                Auth::logout();
                return redirect()->route('upgrade-plan');
            }
        }

        // check if user is already logged in at 2 places (or there are more than 2 active sessions)
        $user_sessions = count(DB::table('sessions')->where('user_id', $user->id)->get());
        $extension_logins = count($user->tokens);
        $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
        if($user_sessions + $extension_logins >= $allowed_logins){
            $message = "Your plan allows ". $allowed_logins ." user/device. [user/users -device/devices] You can log in and disconnect existing devices or upgrade your plan. For support, contact us. ";
            Auth::logout();
            return redirect()->route('login')->with('message', $message);
        }

        // get team accounts
        $user_parent = User::find($user->user_id);
        if ($user_parent) {
            if( $user_parent->pricePlan->code == 'Trial' || $user_parent->pricePlan->code == 'Free' || $user_parent->pricePlan->code == 'Basic'){
                Auth::logout();
                return redirect()->route('upgrade-plan-team');
            }
        }

        $today = Carbon::now();
        $todayDate = $today->toDateString();
        if ($user->price_plan_expiry_date == $todayDate) {
            return redirect()->route('settings.price-plans');
        }
    }
}
