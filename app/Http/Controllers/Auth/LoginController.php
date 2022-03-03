<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request as AuthRequest;

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
                    $this->credentials($request),
                    $request->filled('remember')
                );
            }
        }

        return $this->guard()->attempt(
            $this->credentials($request),
            $request->filled('remember')
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

        $today = Carbon::now();
        $todayDate = $today->toDateString();
        if ($user->price_plan_expiry_date == $todayDate) {
            return redirect()->route('settings.price-plans');
        }
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    protected function sendLoginResponse(\Illuminate\Http\Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        if ($request->is('ui/*')) {
            $user = Auth::user();
            return response()->json(['token' => $user->createToken(
                    explode(":", env("APP_KEY", ":" . \Illuminate\Support\Str::random(60)))[1]
                )->accessToken], 200);
        }

        if ($response = $this->authenticated($request, $this->guard()->user())) {
            return $response;
        }

        return $request->wantsJson()
            ? new \Illuminate\Http\JsonResponse([], 204)
            : redirect()->intended($this->redirectPath());
    }
}
