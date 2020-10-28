<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    //

    public function checkPayment($id){

        return Redirect::route('subscribe',$id);

}

public function subscribePlan($id){

        $AuthUser= Auth::id();
        $user= User::find($AuthUser);
        $user->price_plan_id=$id;
        $user->price_plan_expiry_date=new \DateTime("+1 month");
        $user->update();

        return ['status'=>'plan subscribed','location'=>'/annotation'];

}


}
