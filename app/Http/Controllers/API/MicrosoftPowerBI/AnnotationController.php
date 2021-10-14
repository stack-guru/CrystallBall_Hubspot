<?php

namespace App\Http\Controllers\API\MicrosoftPowerBI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\UserDataSource;
use App\Models\Annotation;

class AnnotationController extends Controller{
    public function index(Request $request){
        $user = Auth::user();
        if (!$user->pricePlan->has_microsoft_power_bi) {
            abort(402);
        }

        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => []];
        }

        $userIdsArray = [];

        if ($user->user_id) {
            // Current user is child, find parent, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to parent so that data source configuration which applies are that of parent
            $user = $user->user;
        } else {
            // Current user is parent, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        }

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id'), $userIdsArray);
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";
        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];

    }
}