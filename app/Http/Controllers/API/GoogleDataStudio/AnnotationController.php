<?php

namespace App\Http\Controllers\API\GoogleDataStudio;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\UserDataSource;
use App\Models\Annotation;
use Illuminate\Support\Carbon;

class AnnotationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_google_data_studio) {
            abort(402, "Please upgrade your plan to use Google Data Studio.");
        }
        $user->last_data_studio_used_at = Carbon::now();
        $user->save();

        $this->validate($request, [
            'startDate' => 'required|date',
            'endDate' => 'required|date',
            'annotation_ga_property_id' => 'nullable|numeric|exists:ga_properties,id'
        ]);

        $this->authorize('viewAny', Annotation::class);

        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";

        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";
        $annotationsQuery .= " WHERE DATE(`show_at`) BETWEEN '" . $request->query('startDate') . "' AND '" . $request->query('endDate') . "'";

        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
    }
}
