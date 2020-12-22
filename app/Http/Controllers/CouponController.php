<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CouponController extends Controller
{
    public function verify(Request $request)
    {
        if (!$request->query('coupon_code')) {
            abort(404);
        }

        $coupon = Coupon::where('code', $request->query('coupon_code'))->first();
        if (!$coupon) {
            return Response::make(['message' => 'Invalid coupon code.'], 404);
        }

        return ['coupon' => $coupon];
    }
}
