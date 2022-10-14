<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Foundation\Auth\ConfirmsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ConfirmPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Confirm Password Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password confirmations and
    | uses a simple trait to include the behavior. You're free to explore
    | this trait and override any functions that require customization.
    |
    */

    use ConfirmsPasswords;

    /**
     * Where to redirect users when the intended url fails.
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
        $this->middleware('auth')->except(['generatePassword']);
    }

    public function generatePassword(Request $request)
    {
        $user = $request->user();

        if($user->password != User::EMPTY_PASSWORD)
            return redirect($this->redirectPath());

        $this->validate($request, [
            'password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers]
        ], [
            'password.min' => 'Must be at least 8 characters.',
        ]);

        $user->forceFill([
            'password' => Hash::make($request->password)
        ])->save();

        event(new \Illuminate\Auth\Events\Registered($user));

        return redirect($this->redirectPath());
    }
}
