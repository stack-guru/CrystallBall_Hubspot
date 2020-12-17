<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PricePlan;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;

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
            'password.min' => 'Must be atleast 8 characters.'
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
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'price_plan_id' => PricePlan::where('price', '<>', 0.00)->where('is_enabled', true)->first()->id,
            'price_plan_expiry_date' => new \DateTime("+14 days"),
            'is_billing_enabled' => false,
        ]);

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
            'url' => 'https://gaannotations.com',
            'description' => 'This is an example to show you how looks the annotations',
            'show_at' => new \DateTime('-02 days'),
        ]);

        return $user;
    }
}
