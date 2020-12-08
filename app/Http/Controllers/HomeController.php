<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\User;
use Illuminate\Http\Request;

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
    public function userServices(Request $request){
        $user = Auth::user();
        if($request->is_ds_holidays_enabled){
            $user->is_ds_holidays_enabled=$request->is_ds_holidays_enabled;
            $user->save();
        }
        if($request->is_ds_google_algorithm_updates_enabled){
            $user->is_ds_google_algorithm_updates_enabled=$request->is_ds_google_algorithm_updates_enabled;
            $user->save();
        }

        return ['user_services'=>$user];

    }

}
