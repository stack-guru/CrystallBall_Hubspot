<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlanNotification;
use Illuminate\Http\Request;

class PlanNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {      
        $planNotifications = PlanNotification::orderBy('created_at', 'DESC')->get();
        return view('admin/plan-notifications/index')->with('planNotifications', $planNotifications);
   
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PlanNotification  $planNotification
     * @return \Illuminate\Http\Response
     */
    public function show(PlanNotification $planNotification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PlanNotification  $planNotification
     * @return \Illuminate\Http\Response
     */
    public function edit(PlanNotification $planNotification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PlanNotification  $planNotification
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PlanNotification $planNotification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PlanNotification  $planNotification
     * @return \Illuminate\Http\Response
     */
    public function destroy(PlanNotification $planNotification)
    {
        $planNotification->delete();

        return redirect()->route('admin.plan-notifications.index');
    }
}
