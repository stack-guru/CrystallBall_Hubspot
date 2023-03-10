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
        }

        $defaultColor = '#1976fe';
        !str_contains($userAnnotationColor->manual, '#') ? $userAnnotationColor->manual = "#FE4C3C" : '';
        !str_contains($userAnnotationColor->csv, '#') ? $userAnnotationColor->csv = "#17DE6B" : '';
        !str_contains($userAnnotationColor->api, '#') ? $userAnnotationColor->api = $defaultColor : '';
        !str_contains($userAnnotationColor->holidays, '#') ? $userAnnotationColor->holidays = $defaultColor : '';
        !str_contains($userAnnotationColor->google_algorithm_updates, '#') ? $userAnnotationColor->google_algorithm_updates = "#FFC514" : '';
        !str_contains($userAnnotationColor->retail_marketings, '#') ? $userAnnotationColor->retail_marketings = $defaultColor : '';
        !str_contains($userAnnotationColor->weather_alerts, '#') ? $userAnnotationColor->weather_alerts = "#FFC514" : '';
        !str_contains($userAnnotationColor->web_monitors, '#') ? $userAnnotationColor->web_monitors = $defaultColor : '';
        !str_contains($userAnnotationColor->wordpress_updates, '#') ? $userAnnotationColor->wordpress_updates = "#253858" : '';
        !str_contains($userAnnotationColor->google_alerts, '#') ? $userAnnotationColor->google_alerts = $defaultColor : '';
        !str_contains($userAnnotationColor->keyword_tracking, '#') ? $userAnnotationColor->keyword_tracking = $defaultColor : '';
        !str_contains($userAnnotationColor->facebook_tracking, '#') ? $userAnnotationColor->facebook_tracking = "#004F9D" : '';
        !str_contains($userAnnotationColor->bitbucket_tracking, '#') ? $userAnnotationColor->bitbucket_tracking = '#253858' : '';
        !str_contains($userAnnotationColor->github_tracking, '#') ? $userAnnotationColor->github_tracking = "#24292F" : '';
        !str_contains($userAnnotationColor->twitter_tracking, '#') ? $userAnnotationColor->twitter_tracking = "#1DA1F2" : '';
        !str_contains($userAnnotationColor->wordpress, '#') ? $userAnnotationColor->wordpress = "#1976FE" : '';
        !str_contains($userAnnotationColor->shopify, '#') ? $userAnnotationColor->shopify = "#00BB4F" : '';
        !str_contains($userAnnotationColor->apple_podcast, '#') ? $userAnnotationColor->apple_podcast = "#A00CE6" : '';
        $userAnnotationColor->save();

        return $userAnnotationColor;
    }
}
