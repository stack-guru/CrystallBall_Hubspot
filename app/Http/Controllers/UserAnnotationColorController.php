<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserAnnotationColorRequest;
use App\Models\UserAnnotationColor;
use Auth;
use Illuminate\Http\Request;

class UserAnnotationColorController extends Controller
{

    public function index(Request $request)
    {
        $userId = Auth::id();

        $userAnnotationColor = $this->createOrFindRecordForUser($userId);

        return ['user_annotation_color' => $userAnnotationColor];
    }

    public function store(UserAnnotationColorRequest $request)
    {
        $userId = Auth::id();

        $userAnnotationColor = $this->createOrFindRecordForUser($userId);

        $userAnnotationColor->fill($request->validated());
        $userAnnotationColor->save();

        return ['user_annotation_color' => $userAnnotationColor];
    }

    private function createOrFindRecordForUser($userId): UserAnnotationColor
    {

        $userAnnotationColor = UserAnnotationColor::where('user_id', $userId)->first();
        if (!$userAnnotationColor) {

            $userAnnotationColor = new UserAnnotationColor;
            $userAnnotationColor->user_id = $userId;

            $userAnnotationColor->manual = '#227c9d';
            $userAnnotationColor->csv = '#227c9d';
            $userAnnotationColor->api = '#227c9d';
            $userAnnotationColor->holidays = '#227c9d';
            $userAnnotationColor->google_algorithm_updates = '#227c9d';
            $userAnnotationColor->retail_marketings = '#227c9d';
            $userAnnotationColor->weather_alerts = '#227c9d';
            $userAnnotationColor->web_monitors = '#227c9d';
            $userAnnotationColor->wordpress_updates = '#227c9d';
            $userAnnotationColor->google_alerts = '#227c9d';

            $userAnnotationColor->save();
        }

        return $userAnnotationColor;
    }
}
