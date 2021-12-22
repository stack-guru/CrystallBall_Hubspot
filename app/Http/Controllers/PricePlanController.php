<?php

namespace App\Http\Controllers;

use App\Http\Requests\PricePlanRequest;
use App\Models\PricePlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class PricePlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    public function uiIndex()
    {
        $pricePlans = PricePlan::where('is_enabled', true)->get();

        return ['price_plans' => $pricePlans];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PricePlanRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function show(PricePlan $pricePlan)
    {
        if (Auth::user()->user_level !== User::ADMIN) abort(403, 'Only administrators are allowed to view price plan.');
        return ['price_plan' => $pricePlan];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function edit(PricePlan $pricePlan)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PricePlan  $pricePlan
     * @return \Illuminate\Http\Response
     */
    public function destroy(PricePlan $pricePlan)
    {
        //
    }
}
