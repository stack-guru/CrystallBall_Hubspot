<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CookieCoupon;
use App\Models\PricePlan;
use App\Models\User;
use App\Models\UserDataSource;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use App\Services\SendGridService;
use Auth;
use Cookie;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        $this->middleware('guest');
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers],
            'read_confirmation' => ['required'],
        ], [
            'read_confirmation.required' => 'Your confirmation is required.',
            'password.min' => 'Must be atleast 8 characters.',
        ]);
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
                $planExpiryDate = new \DateTime("+14 days");
            }
        } else {
            $planExpiryDate = new \DateTime("+14 days");
        }
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'price_plan_id' => PricePlan::where('name', '=', 'Trial')->first()->id,
            'price_plan_expiry_date' => $planExpiryDate,
            'is_billing_enabled' => false,
        ]);

        $userDataSource = new UserDataSource;
        $userDataSource->user_id = $user->id;
        $userDataSource->ds_code = 'wordpress_updates';
        $userDataSource->ds_name = 'WordpressUpdate';
        $userDataSource->country_name = null;
        $userDataSource->retail_marketing_id = null;
        $userDataSource->value = 'last year';
        $userDataSource->save();

        $sGS = new SendGridService;
        $sGS->addUserToMarketingList($user, "1 GAa New registrations");

        // event_name:
        // Sample Annotation
        // category:
        // GAannotations
        // description:
        // This is an example to show you how looks the annotations
        // Date:
        // [Two_days_before_user_registration_date]

        $user->annotations()->create([
            'category' => 'GAannotations',
            'event_name' => 'Sample Annotation',
            'url' => route('annotation.index'),
            'description' => 'This is an annotation example',
            'show_at' => new \DateTime('-02 days'),
            'is_enabled' => true,
        ]);

        return $user;
    }

    public function registerLoginGoogle()
    {

        return Socialite::driver('google')
            ->scopes([
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
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
                $user->password = '.';
                $user->name = $newUser->getName();
                $user->price_plan_id = PricePlan::where('name', '=', 'Trial')->first()->id;
                $user->price_plan_expiry_date = new \DateTime("+14 days");
                $user->is_billing_enabled = false;
                $user->save();

                $user->annotations()->create([
                    'category' => 'GAannotations',
                    'event_name' => 'Sample Annotation',
                    'url' => 'https://gaannotations.com',
                    'description' => 'This is an example to show you how looks the annotations',
                    'show_at' => new \DateTime('-02 days'),
                    'is_enabled' => true,
                ]);

                $sGS = new SendGridService;
                $sGS->addUserToMarketingList($user, "1 GAa New registrations");

            }
        }

        Auth::login($user);
        return redirect()->route('annotation.index');

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
        return view('auth.register');
    }
}
