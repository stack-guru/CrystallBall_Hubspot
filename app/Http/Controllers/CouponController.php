<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function verify(Request $request)
    {
        if (!$request->query('coupon_code')) {
            abort(404);
        }

        $coupon = Coupon::where('code', $request->query('coupon_code'))->first();
        if (!$coupon) {
            abort(404);
        }

        return ['coupon' => $coupon];
    }
}
