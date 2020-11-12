<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\User;

class HomeController extends Controller
{
    public function uiUserShow()
    {
        $user = Auth::user();
        $user->load('pricePlan');
        if ($user->last_login_at == null) {
            User::where('id', $user->id)
                ->update([
                    'last_login_at' => new \DateTime,
                ]);
        }

        return ['user' => $user];
    }

}
