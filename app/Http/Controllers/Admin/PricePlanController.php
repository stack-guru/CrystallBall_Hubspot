<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PricePlanRequest;
use App\Models\PricePlan;
use Illuminate\Http\Request;

class PricePlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin/price-plan/index')->with('pricePlans', PricePlan::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/price-plan/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PricePlanRequest $request)
    {
        $pricePlan = new PricePlan;
        $pricePlan->fill($request->validated());
        $pricePlan->has_manual_add = $request->has_manual_add == 'on';
        $pricePlan->has_csv_upload = $request->has_csv_upload == 'on'; 
        $pricePlan->has_api = $request->has_api == 'on'; 
        $pricePlan->is_enabled = $request->is_enabled == 'on'; 

        $pricePlan->save();

        return redirect()->route('admin.price-plan.show', $pricePlan->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function show(PricePlan $pricePlan)
    {
        return view('admin/price-plan/show')->with('pricePlan', $pricePlan);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function edit(PricePlan $pricePlan)
    {
        return view('admin/price-plan/edit')->with('pricePlan', $pricePlan);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function update(PricePlanRequest $request, PricePlan $pricePlan)
    {
        $pricePlan->fill($request->validated());
        $pricePlan->has_manual_add = $request->has_manual_add == 'on';
        $pricePlan->has_csv_upload = $request->has_csv_upload == 'on'; 
        $pricePlan->has_api = $request->has_api == 'on'; 
        $pricePlan->is_enabled = $request->is_enabled == 'on'; 
        $pricePlan->save();

        return redirect()->route('admin.price-plan.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function destroy(PricePlan $pricePlan)
    {
        $pricePlan->delete();

        return redirect()->route('admin.price-plan.index');
    }
}
