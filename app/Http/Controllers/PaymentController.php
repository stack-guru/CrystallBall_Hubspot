<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    //

    public function checkPayment(Request $request)
    {

        return Redirect::route('payment.subscribe', ['price_plan_id' => $request->price_plan_id]);

    }

    public function subscribePlan(Request $request)
    {

        $user = Auth::user();
        $user->price_plan_id = $request->query('price_plan_id');
        $user->price_plan_expiry_date = new \DateTime("+1 month");
        $user->update();

        return Redirect::route('annotation.index', ['payment_successfull' => true]);

    }

}
