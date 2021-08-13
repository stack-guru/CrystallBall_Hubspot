<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
     */

    use RegistersUsers;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    public function updatePassword(Request $request)
    {
        $this->validate($request, [
            'new_password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        ]);


        $user = Auth::user();
        $user->password = Hash::make($request->new_password);
        $user->email = $request->email;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'Updated successfully'], 200);
    }

    /**
     * Get the password reset validation rules.
     *
     * @return array
     */
    protected function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers],
        ];
    }

    /**
     * Get the password reset validation error messages.
     *
     * @return array
     */
    protected function validationErrorMessages()
    {
        return [];
    }
}
