<?php

namespace App\Http\Controllers\API\AppSumo;

use App\Http\Controllers\Controller;
use App\Models\AppSumoApiUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function generateToken(Request $request)
    {
        $this->validate($request, [
            'username' => 'bail|required|string|exists:app_sumo_users,username',
            'password' => 'required|string'
        ]);

        $appSumoApiUser = AppSumoApiUser::where('username', $request->username)->get();

        if ($appSumoApiUser->password != bcrypt($request->password)) {
            return response()->json(['message' => 'Invalid password for the given username.'], 400);
        }

        // Generating new access token will revoke all previous access tokens
        $appSumoApiUser->access_token = Str::random(100);

        $appSumoApiUser->save();

        return response()->json(["access" => $appSumoApiUser->access_token], 201);
    }

    
}
