<?php

namespace App\Http\Controllers;

use App\Models\GoogleAlgorithmUpdate;
use Illuminate\Http\Request;

class GoogleAlgorithmUpdateController extends Controller
{
    public function uiIndex(Request $request)
    {
        if ($request->has('status')) {
            $googleAlgorithmUpdates = GoogleAlgorithmUpdate::where('status', $request->query('status'))->get();
        } else {
            $googleAlgorithmUpdates = GoogleAlgorithmUpdate::all();
        }
        return ['google_algorithm_updates' => $googleAlgorithmUpdates];
    }
}
