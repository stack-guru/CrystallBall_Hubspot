<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationOfferRequest;
use App\Models\RegistrationOffer;
use Illuminate\Http\Request;

class RegistrationOfferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin/registration-offer/index')->with('registrationOffers', RegistrationOffer::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/registration-offer/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RegistrationOfferRequest $request)
    {
        $registrationOffer = new RegistrationOffer;
        $registrationOffer->fill($request->validated());
        $registrationOffer->is_enabled = $request->is_enabled == 'on';
        $registrationOffer->save();

        return redirect()->route('admin.registration-offer.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RegistrationOffer  $registrationOffer
     * @return \Illuminate\Http\Response
     */
    public function show(RegistrationOffer $registrationOffer)
    {
        return view('admin/registration-offer/show')->with('registrationOffer', $registrationOffer);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RegistrationOffer  $registrationOffer
     * @return \Illuminate\Http\Response
     */
    public function edit(RegistrationOffer $registrationOffer)
    {
        return view('admin/registration-offer/edit')->with('registrationOffer', $registrationOffer);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RegistrationOffer  $registrationOffer
     * @return \Illuminate\Http\Response
     */
    public function update(RegistrationOfferRequest $request, RegistrationOffer $registrationOffer)
    {
        $registrationOffer->fill($request->validated());
        $registrationOffer->is_enabled = $request->is_enabled == 'on';
        $registrationOffer->save();

        return redirect()->route('admin.registration-offer.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RegistrationOffer  $registrationOffer
     * @return \Illuminate\Http\Response
     */
    public function destroy(RegistrationOffer $registrationOffer)
    {
        $registrationOffer->delete();

        return redirect()->route('admin.registration-offer.index');
    }
}
