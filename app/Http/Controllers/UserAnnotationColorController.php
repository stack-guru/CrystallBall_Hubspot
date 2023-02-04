<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserAnnotationColorRequest;
use App\Models\UserAnnotationColor;
use Illuminate\Support\Facades\Auth;
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

            $defaultColor = '#1976fe';
            $userAnnotationColor->manual = $defaultColor;
            $userAnnotationColor->csv = $defaultColor;
            $userAnnotationColor->api = $defaultColor;
            $userAnnotationColor->holidays = $defaultColor;
            $userAnnotationColor->google_algorithm_updates = $defaultColor;
            $userAnnotationColor->retail_marketings = $defaultColor;
            $userAnnotationColor->weather_alerts = $defaultColor;
            $userAnnotationColor->web_monitors = $defaultColor;
            $userAnnotationColor->wordpress_updates = $defaultColor;
            $userAnnotationColor->google_alerts = $defaultColor;
            $userAnnotationColor->keyword_tracking = $defaultColor;
            $userAnnotationColor->facebook_tracking = $defaultColor;
            $userAnnotationColor->bitbucket_tracking = $defaultColor;
            $userAnnotationColor->github_tracking = $defaultColor;
            $userAnnotationColor->wordpress = $defaultColor;
            $userAnnotationColor->shopify = $defaultColor;
            $userAnnotationColor->apple_podcast = $defaultColor;

            $userAnnotationColor->save();
        }

        return $userAnnotationColor;
    }
}
