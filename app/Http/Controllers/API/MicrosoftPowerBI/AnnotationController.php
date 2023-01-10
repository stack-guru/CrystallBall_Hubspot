<?php

namespace App\Http\Controllers\API\MicrosoftPowerBI;

use App\Helpers\AnnotationQueryHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\UserDataSource;
use App\Models\Annotation;

class AnnotationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_microsoft_power_bi) {
            abort(402, "Please upgrade your plan to use Microsoft Power Bi.");
        }

        $this->validate($request, [
            'startDate' => 'required|date',
            'endDate' => 'required|date',
            'annotation_ga_property_id' => 'nullable|numeric|exists:ga_properties,id'
        ]);

        $userIdsArray = $user->getAllGroupUserIdsArray();

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id') ? $request->query('annotation_ga_property_id') : '*', $userIdsArray, '*', false);
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable";
        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // Apply google analytics property filter if the value for filter is provided
        if ($request->query('annotation_ga_property_id') && $request->query('annotation_ga_property_id') !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $request->query('annotation_ga_property_id') . ") ";
        }
        $annotationsQuery .= " WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "'";
        $annotationsQuery .= " ORDER BY show_at ASC";
        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
    }
}
