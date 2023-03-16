<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationMail;
use App\Mail\RequestInvitationMail;
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

    private function isTemporaryEmail(string $email): bool
    {
        $filename = public_path('temp_email_domains.txt');
        $tempEmailDomains = [];

        // check if file is older than 6 hours
        if (file_exists($filename) && time() - filemtime($filename) < 6 * 60 * 60) {
            $tempEmailDomains = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        } else {
            // download new list from GitHub
            $url = 'https://raw.githubusercontent.com/andreis/disposable-email-domains/master/domains.txt';
            $tempEmailDomains = file($url, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            // save list to file
            file_put_contents($filename, implode("\n", $tempEmailDomains));
        }

        $domain = explode('@', $email)[1];
        return in_array($domain, $tempEmailDomains);
    }

    private function isFreeEmail(string $email): bool
    {
        $freeEmailDomains = [
            'gmail.com',
            'yahoo.com',
            'ymail.com',
            'rocketmail.com',
            'hotmail.com',
            'outlook.com',
            'live.com',
            'msn.com',
            'aol.com',
            'aim.com',
            'mail.com',
            'email.com',
            'usa.com',
            'myself.com',
            'consultant.com',
            'post.com',
            'lawyer.com',
            'techie.com',
            'dr.com',
            'engineer.com',
            'accountant.com',
            'journalist.com',
            'zoho.com',
            'protonmail.com',
            'tutanota.com',
            'gmx.com',
            'gmx.us',
            'hushmail.com',
            'yandex.com',
            'yandex.ru',
            'mail.ru',
            'inbox.ru',
            'list.ru',
            'inbox.lv',
            'startmail.com',
            'guerrillamail.com',
            'icloud.com',
            't-online.de',
            'prodigy.net',
            '163.com',
            '126.com',
            'qq.com',
            'naver.com',
            'daum.net',
            'foxmail.com',
            'gmf.fr',
            'laposte.net',
            'free.fr',
            'rediffmail.com',
            'zoho.com/workplace',
            //  extra that were in the array
            '10minutemail.com',
            'mailnator.com',
            'temp-mail.org',
            'e4ward.com',
            'guerrillamail.com',
            'mohmal.com',
            'throwawaymail.com',
            'getnada.com',
            'yopmail.com',
            'spambox.xyz',
            'trashmail.top',
            'tempmail.win',
            'postbox.cyou',
            'msn.com',
            'tutanota.com',
            'posteo.com',
            'startmail.com',
            'runbox.com',
            'countermail.com',
            'protonmail.com',
            'mailbox.org',
            'mailfence.com'
        ];

        $domain = explode('@', $email)[1];
        return in_array($domain, $freeEmailDomains);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                // email validation(only business email available.)
                function ($attribute, $value, $fail) {
                    $domain = explode('@', $value)[1] ?? null;
                    if (!$domain) {
                        $fail('The ' . $attribute . ' is null.');
                        return false;
                    }

                    if ($this->isTemporaryEmail($value) || $this->isFreeEmail($value)) {
                        $fail('The ' . $attribute . ' must be a business email address!.');
                        return false;
                    }

                    $user = User::where('email', $value)->first();
                    if ($user) {
                        if (!$user->hasVerifiedEmail() || ($user->password === User::EMPTY_PASSWORD && $user->has_password == true)) {
                            Mail::to($user->email)->send(new EmailVerificationMail($user));
                            $fail('The ' . $attribute . ' has already been registered. Please check your email for confirmation!');
                            return false;
                        } else {
                            $fail('The ' . $attribute . ' has already been taken.');
                            return false;
                        }
                    }

                   $count = User::where('email', 'like', '%@' . $domain)->count();

                   if ($count > 0) {
                       $fail('COMPANY_ALREADY_EXIST');
                       return false;
                   }
                    $userExist = User::where('email', $value)->first();
                    // $userExist = User::where('email','LIKE','%'.$domainPart)->first();
                    if ($userExist) {
                        $fail('This user already exist with same company email.');
                        return false;
                    }
                    return true;
                },
            ],
            'read_confirmation' => ['required'],
            'g-recaptcha-response' => [new ValidateCaptcha],
        ], [
            'read_confirmation.required' => 'Your confirmation is required.',
        ]);
    }


    public function requestInvitation(Request $request)
    {
        $userDetail = explode('@', $request->email);
        $name = $userDetail[0];
        $domain = $userDetail[1];
        $admin = User::where('user_level', 'admin')->where('email', 'LIKE', '%' . $domain . '%')->first();

        $user = new User();
        $user->email = $request->email;
        $user->name = $name;
        Mail::to($admin->email)->send(new RequestInvitationMail($user, $admin));
        return response(['status' => true, 'message' => 'Success']);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->merge([
            'name' => explode('@', $request->email)[0] ?? null
        ]);
        $this->validator($request->all())->validate();
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
     * @param array $data
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
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => User::EMPTY_PASSWORD,
            'price_plan_id' => PricePlan::where('name', PricePlan::TRIAL)->first()->id,
            'price_plan_expiry_date' => $planExpiryDate,
        ]);
        $user->is_billing_enabled = false;
        $user->save();

        // add device/browser
        try {
            UserActiveDevice::create([
                'user_id' => $user->id,

                'browser_name' => Browser::browserName(),
                'platform_name' => Browser::platformFamily(),
                'device_type' => Browser::platformName(),

                'is_extension' => false,
                'ip' => request()->ip(),

                'session_id' => Session::getId() ?? null,
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
        $user = User::where('email', $newUserEmail)->first();

        if (!$user) {
            if (!$newUserEmail) {
                return redirect()->back()->with('error', 'Users without email addresses are not allowed to login!');
            } else {
                $user = User::where('email', $newUserEmail)->first();

                $user = new User;
                $user->email = $newUserEmail;
                $user->password = User::EMPTY_PASSWORD;
                $user->name = $newUser->getName();
                $user->price_plan_id = PricePlan::where('name', PricePlan::TRIAL)->first()->id;
                $user->price_plan_expiry_date = new \DateTime("+7 days");
                $user->is_billing_enabled = false;
                $user->email_verified_at = Carbon::now();
                $user->has_password = false;
                $user->save();

                try {
                    UserActiveDevice::create([
                        'user_id' => $user->id,

                        'browser_name' => Browser::browserName(),
                        'platform_name' => Browser::platformFamily(),
                        'device_type' => Browser::platformName(),

                        'is_extension' => false,
                        'ip' => request()->ip(),

                        'session_id' => Session::getId() ?? null,
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
                'has_password' => false,
                'email_verified_at' => now(),
            ]);
            // check if user is already logged in at 2 places (or there are more than 2 active sessions)
            Auth::login($user);
            $allowed = UserActiveDevice::allowedToLogin($user, request(), $type = 'web');
            if (!$allowed) {
                $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
                $message = "Your plan allows " . $allowed_logins . " user/device. You can log in and disconnect existing devices or upgrade your plan. For support, <a target='_blank' href='mailto:contact@crystalballinsight.com'>contact us</a>.";
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
