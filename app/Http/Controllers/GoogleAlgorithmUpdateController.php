<?php

namespace App\Http\Controllers;

use App\Models\GoogleAlgorithmUpdate;
use Illuminate\Http\Request;

class GoogleAlgorithmUpdateController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('status')) {
            if ($request->query('status') == 'confirmed') {
                $googleAlgorithmUpdates = GoogleAlgorithmUpdate::where('confirmed', true)->get();
            } else {
                $googleAlgorithmUpdates = GoogleAlgorithmUpdate::where('confirmed', false)->get();
            }
        } else {
            $googleAlgorithmUpdates = GoogleAlgorithmUpdate::all();
        }
        return ['google_algorithm_updates' => $googleAlgorithmUpdates];
    }
}
