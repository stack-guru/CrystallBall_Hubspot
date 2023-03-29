<?php

namespace App\Http\Controllers;

use App\Http\Requests\PricePlanRequest;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

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
        $pricePlans = PricePlan::where('is_enabled', true)->where('is_hidden', false)->orderBy('sort_rank')->get();

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
        if (Auth::user()->user_level !== User::ADMIN) {
            abort(403, 'Only administrators are allowed to view price plan.');
        }

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

    /**
     * Extend price plan if user on free new plan
     *
     * @return \Illuminate\Http\Response
     */
    public function extendTrial()
    {
        $userId = Auth::id();
        try {
            User::where('id', $userId)->update([
                'users.price_plan_id'          => PricePlan::where('name', PricePlan::TRIAL)->first()->id,
                'users.price_plan_expiry_date' => new \DateTime("+7 days"),
                'price_plan_settings'          => [
                    'extended_trial' => [
                        'activation_count' => 1,
                        'extended_at'      => now()->toDateTimeString(),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::critical(__METHOD__ . ":" . $e->getMessage(), $e->getTrace());
            return response()->json([
                'status' => false,
                'message' => 'Something Went Wrong'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'status' => true,
            'message' => 'Trials extended to additional 7 days'
        ], Response::HTTP_ACCEPTED);
    }
}
