<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GoogleAlertRequest;
use App\Models\GoogleAlert;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GoogleAlertController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $googleAlerts = GoogleAlert::orderBy('updated_at', 'DESC')->get();
        return view('admin/data-source/google-alert/index')->with('googleAlerts', $googleAlerts);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GoogleAlert  $googleAlert
     * @return \Illuminate\Http\Response
     */
    public function destroy(GoogleAlert $googleAlert)
    {
        $googleAlert->delete();
        return redirect()->route('admin.data-source.google-alert.index')->with('success', true);
    }

}
