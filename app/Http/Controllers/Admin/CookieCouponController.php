<?php

namespace App\Http\Controllers\Admin;

use App\Models\CookieCoupon;
use App\Http\Requests\CookieCouponRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CookieCouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cookieCoupons = CookieCoupon::all();
        return view('admin/cookie-coupon/index')->with('cookieCoupons', $cookieCoupons);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/cookie-coupon/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CookieCouponRequest $request)
    {
        $cookieCoupon = new CookieCoupon;
        $cookieCoupon->fill($request->validated());
        $cookieCoupon->save();
        return redirect()->route('admin.cookie-coupon.index')->with('success', true);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CookieCoupon  $cookieCoupon
     * @return \Illuminate\Http\Response
     */
    public function show(CookieCoupon $cookieCoupon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CookieCoupon  $cookieCoupon
     * @return \Illuminate\Http\Response
     */
    public function edit(CookieCoupon $cookieCoupon)
    {
        return view('admin/cookie-coupon/edit')->with('cookieCoupon', $cookieCoupon);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CookieCoupon  $cookieCoupon
     * @return \Illuminate\Http\Response
     */
    public function update(CookieCouponRequest $request, CookieCoupon $cookieCoupon)
    {
        $cookieCoupon->fill($request->validated());
        $cookieCoupon->save();
        return redirect()->route('admin.cookie-coupon.index')->with('success', true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CookieCoupon  $cookieCoupon
     * @return \Illuminate\Http\Response
     */
    public function destroy(CookieCoupon $cookieCoupon)
    {
        $cookieCoupon->delete();
        return redirect()->route('admin.cookie-coupon.index')->with('success', true);
    }
}
