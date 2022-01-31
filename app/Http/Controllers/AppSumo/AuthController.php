<?php

namespace App\Http\Controllers\AppSumo;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showPasswordForm()
    {
        return view('app-sumo/password');
    }

    public function updatePassword(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers],
        ]);

        $user = Auth::user();
        $user->name = $request->name;
        $user->password = bcrypt($request->new_password);
        $user->save();

        return redirect(RouteServiceProvider::HOME);
    }
}
