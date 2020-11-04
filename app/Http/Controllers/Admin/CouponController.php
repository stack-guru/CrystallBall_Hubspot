<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $data['coupons']=Coupon::all();
        return view('admin/coupon/index',$data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return view('admin/coupon/add');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //

        $request->validate([
            'name'=>'required',
            'code'=>'required',
            'discount_percent'=>'required',
            'expires_at'=>'date|required'

        ]);

        $coupon =new Coupon;
        $coupon->fill($request->except('_token'));
        $coupon->save();
        return redirect()->route('admin.coupon.index')->with('msg','new coupon added successfully');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $data['coupon']=Coupon::find($id);
        return view('admin/coupon/edit',$data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //

        $request->validate([
            'name'=>'required',
            'code'=>'required',
            'discount_percent'=>'required',
            'expires_at'=>'date|required'

        ]);

        $coupon =Coupon::find($id);
        $coupon->fill($request->except('_token','_method'));
        $coupon->update();
        return redirect()->route('admin.coupon.index')->with('msg','Coupon updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $coupon=Coupon::find($id);
        $coupon->delete();
        return redirect()->route('admin.coupon.index')->with('msg','Coupon deleted successfully');
    }
}
