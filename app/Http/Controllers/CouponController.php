<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CouponController extends Controller
{
    public function verify(Request $request)
    {
        $this->validate($request, [
            'coupon_code' => 'required'  
        ]);

        $coupon = Coupon::where('code', $request->query('coupon_code'))->first();
        // check if coupon is expired
        if($coupon){
            if($coupon->expires_at <= today()){
                return Response::make(['message' => 'Coupon expired.'], 404);
            }
        }
        if (!$coupon) {
            return Response::make(['message' => 'Invalid coupon code.'], 404);
        }

        return ['coupon' => $coupon];
    }
}
