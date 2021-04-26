<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Foundation\Auth\ResetsPasswords;
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

    use ResetsPasswords;

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
        ]);

        $user = Auth::user();

        $user->password = Hash::make($request->new_password);
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'password updated successfully'], 200);
    }
    
    
    public function setTimezone(Request $request)
    {
        // return $request->timezone;
        $request->validate([
            'timezone'=>'required',
        ]);
        $user = Auth::user();
        $user->timezone = $request->timezone;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'TimeZone updated successfully'], 200);
    }

    public function getUser(Request $request)
    {
        // return $request->timezone;
    
        $user = Auth::user();
        return response()->json(['success' => 'true', 'data' => $user->timezone], 200);
    }
}
