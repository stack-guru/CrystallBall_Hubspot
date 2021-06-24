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
        $userAnnotationColor = UserAnnotationColor::where('user_id', $userId)->first();
        if (!$userAnnotationColor) {
            $userAnnotationColor = new UserAnnotationColor;
            $userAnnotationColor->user_id = $userId;
            $userAnnotationColor->save();
        }
        return ['user_annotation_color' => $userAnnotationColor];

    }

    public function store(UserAnnotationColorRequest $request)
    {
        $userId = Auth::id();
        $userAnnotationColor = UserAnnotationColor::where('user_id', $userId)->first();
        if (!$userAnnotationColor) {
            $userAnnotationColor = new UserAnnotationColor;
            $userAnnotationColor->user_id = $userId;
        }

        $userAnnotationColor->fill($request->validated());
        $userAnnotationColor->save();

        return ['user_annotation_color' => $userAnnotationColor];
    }

}
