<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\ResetsPasswords;
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

    public function updatePassword(Request $request){
        //
        $this->validate($request,[
            'prePassword'=>'required',
            'password'=>'required',
            'rPassword'=>'required'
        ]);
        $user=Auth::user();
        if(Hash::check($request->prePassword, $user->password)  && $request->password == $request->rPassword){
            $user->update(['password'=>$request->password]);
        }
        return response()->json(['success'=>'true','message'=>'password updated successfully'],200);
    }

}
