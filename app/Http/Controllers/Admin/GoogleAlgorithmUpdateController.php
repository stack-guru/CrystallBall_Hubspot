<?php

namespace App\Http\Controllers\Admin;

use App\Models\GoogleAlgorithmUpdate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\GoogleAlgorithmUpdateRequest;

class GoogleAlgorithmUpdateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $googleAlgorithmUpdates = GoogleAlgorithmUpdate::orderBy('updated_at', 'DESC')->get();
        return view('admin/data-source/google-algorithm/index')->with('googleAlgorithmUpdates', $googleAlgorithmUpdates);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/data-source/google-algorithm/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GoogleAlgorithmUpdateRequest $request)
    {
        GoogleAlgorithmUpdate::create($request->validated());
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function edit(GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        return view('admin/data-source/google-algorithm/edit')->with('googleAlgorithmUpdate', $googleAlgorithmUpdate);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function update(GoogleAlgorithmUpdateRequest $request, GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        $googleAlgorithmUpdate->fill($request->validated());
        $googleAlgorithmUpdate->save();
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function destroy(GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        $googleAlgorithmUpdate->delete();
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
    }
}
