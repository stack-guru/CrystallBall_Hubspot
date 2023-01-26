<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationMail;
use App\Models\CookieCoupon;
use App\Models\GoogleAccount;
use App\Models\PricePlan;
use App\Models\User;
use App\Models\UserActiveDevice;
use App\Providers\RouteServiceProvider;
use App\Rules\ValidateCaptcha;
use Browser;
use Exception;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
     */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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
        $this->middleware('guest')->except(['logoutAndDestroy']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name'                 => ['required', 'string', 'max:255'],
            'email'                => [
                'required',
                'string',
                'email',
                'max:255',
                // email validation(only business email available.)
                function ($attribute, $value, $fail){                                       
                    $domainPart = explode('@', $value)[1] ?? null;
                    if (!$domainPart) {
                        $fail('The ' . $attribute . ' is null.');
                    }
                    if ($domainPart == 'gmail.com'
                        || $domainPart == 'outlook.com'
                        || $domainPart == 'yahoo.com'
                        || $domainPart == '10minutemail.com'
                        || $domainPart == 'mailnator.com'
                        || $domainPart == 'temp-mail.org'
                        || $domainPart == 'e4ward.com'
                        || $domainPart == 'guerrillamail.com'
                        || $domainPart == 'mohmal.com'
                        || $domainPart == 'throwawaymail.com'
                        || $domainPart == 'getnada.com'
                        || $domainPart == 'yopmail.com'
                        || $domainPart == 'spambox.xyz'
                        || $domainPart == 'trashmail.top'
                        || $domainPart == 'tempmail.win'
                        || $domainPart == 'postbox.cyou'
                        || $domainPart == 'msn.com'
                        || $domainPart == 'tutanota.com'
                        || $domainPart == 'posteo.com'
                        || $domainPart == 'startmail.com'
                        || $domainPart == 'runbox.com'
                        || $domainPart == 'countermail.com'
                        || $domainPart == 'protonmail.com'
                        || $domainPart == 'mailbox.org'
                        || $domainPart == 'mailfence.com') {
                        $fail('The ' . $attribute . ' must be a business email address!');
                    }
                    return true;
                },
                // 
                function ($attribute, $value, $fail) {

                    $user = User::where('email', $value)->first();
                    if ($user) {
                        if (!$user->hasVerifiedEmail() || ($user->password === User::EMPTY_PASSWORD && $user->has_password == true)) {
                            Mail::to($user->email)->send(new EmailVerificationMail($user));
                            $fail('The ' . $attribute . ' has already been registered. Please check your email for confirmation!');
                        } else {
                            $fail('The ' . $attribute . ' has already been taken.');
                        }
                    }

                },
            ],
            'read_confirmation'    => ['required'],
            'g-recaptcha-response' => [new ValidateCaptcha],
        ], [
            'read_confirmation.required' => 'Your confirmation is required.',
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->merge([
            'name' => explode('@', $request->email)[0] ?? null
        ]);
        $this->validator($request->all())->validate();
        $user = User::where('email','LIKE','%'.explode('@', $request->email)[1].'%')->first();
        if ($user) {
            return redirect()->to(url('email_error'));
        }
        event(new \App\Events\RegisteredNewUser($user = $this->create($request->all())));

        $this->guard()->login($user);

        if ($response = $this->registered($request, $user)) {
            return $response;
        }

        return $request->wantsJson()
        ? new JsonResponse([], 201)
        : redirect($this->redirectPath());
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        if (Cookie::get('coupon_code')) {
            $cookieCoupon = CookieCoupon::where('code', Cookie::get('coupon_code'))->first();
            if ($cookieCoupon) {
                Cookie::queue(Cookie::forget('coupon_code'));
                $planExpiryDate = new \DateTime("+" . $cookieCoupon->plan_extension_days . " days");
            } else {
                $planExpiryDate = new \DateTime("+7 days");
            }
        } else {
            $planExpiryDate = new \DateTime("+7 days");
        }
        $user = User::create([
            'name'                   => $data['name'],
            'email'                  => $data['email'],
            'password'               => User::EMPTY_PASSWORD,
            'price_plan_id'          => PricePlan::where('name', PricePlan::TRIAL)->first()->id,
            'price_plan_expiry_date' => $planExpiryDate,
        ]);
        $user->is_billing_enabled = false;
        $user->save();

        // add device/browser
        try {
            UserActiveDevice::create([
                'user_id'         => $user->id,

                'browser_name'    => Browser::browserName(),
                'platform_name'   => Browser::platformFamily(),
                'device_type'     => Browser::platformName(),

                'is_extension'    => false,
                'ip'              => request()->ip(),

                'session_id'      => Session::getId() ?? null,
                'access_token_id' => null,

            ]);
        } catch (Exception $ex) {
            info(print_r($ex->getMessage()));
        }

        return $user;
    }

    public function registerLoginGoogle()
    {

        return Socialite::driver('google')
            ->scopes([
                GoogleAccount::SCOPE_AUTH_USERINFO_PROFILE,
                GoogleAccount::SCOPE_AUTH_USERINFO_EMAIL,
            ])
            ->redirectUrl(route('socialite.google.redirect'))
            ->redirect();
    }

    public function registerLoginGoogleRedirect()
    {
        $newUser = Socialite::driver('google')->redirectUrl(route('socialite.google.redirect'))->stateless()->user();

        $newUserEmail = $newUser->getEmail();
        $user         = User::where('email', $newUserEmail)->first();

        if (!$user) {
            if (!$newUserEmail) {
                return redirect()->back()->with('error', 'Users without email addresses are not allowed to login!');
            } else {
                $user = User::where('email', $newUserEmail)->first();

                $user                         = new User;
                $user->email                  = $newUserEmail;
                $user->password               = User::EMPTY_PASSWORD;
                $user->name                   = $newUser->getName();
                $user->price_plan_id          = PricePlan::where('name', PricePlan::TRIAL)->first()->id;
                $user->price_plan_expiry_date = new \DateTime("+7 days");
                $user->is_billing_enabled     = false;
                $user->email_verified_at      = Carbon::now();
                $user->has_password           = false;
                $user->save();

                try {
                    UserActiveDevice::create([
                        'user_id'         => $user->id,

                        'browser_name'    => Browser::browserName(),
                        'platform_name'   => Browser::platformFamily(),
                        'device_type'     => Browser::platformName(),

                        'is_extension'    => false,
                        'ip'              => request()->ip(),

                        'session_id'      => Session::getId() ?? null,
                        'access_token_id' => null,

                    ]);
                } catch (Exception $ex) {
                    info(print_r($ex->getMessage()));
                }

                event(new \App\Events\RegisteredNewUser($user));
                event(new \Illuminate\Auth\Events\Registered($user));

                Auth::login($user);

                return redirect()->route('annotation.index');

                // Auth::login($user);
                // $googleAccount = new GoogleAccount;
                // $this->addGoogleAccount($newUser, $googleAccount, $user);
            }
        } else {

            $user->update([
                'has_password'      => false,
                'email_verified_at' => now(),
            ]);
            // check if user is already logged in at 2 places (or there are more than 2 active sessions)
            Auth::login($user);
            $allowed = UserActiveDevice::allowedToLogin($user, request(), $type = 'web');
            if (!$allowed) {
                $allowed_logins = (int) $user->pricePlan->users_devices_count ?? 2;
                $message        = "Your plan allows " . $allowed_logins . " user/device. You can log in and disconnect existing devices or upgrade your plan. For support, <a target='_blank' href='mailto:contact@crystalballinsight.com'>contact us</a>.";
                Auth::logout();
                return redirect()->route('login')->with('message', $message);
            }

            return redirect()->route('annotation.index');
        }

    }

    /**
     * Show the application registration form.
     *
     * @return \Illuminate\View\View
     */
    public function showRegistrationForm(Request $request)
    {
        if ($request->query('coupon_code')) {
            $cookieCoupon = CookieCoupon::where('code', $request->query('coupon_code'))->first();
            if ($cookieCoupon) {
                Cookie::queue('coupon_code', $request->query('coupon_code'));
            }
        }
        if ($request->has('email')) {
            return view('auth.register-email');
        }

        return view('auth.register-google');
    }

    public function logoutAndDestroy()
    {
        $authId = Auth::id();
        Auth::logout();

        User::where('id', $authId)->delete();

        return Redirect::route('register', ['email' => 1]);
    }
}
