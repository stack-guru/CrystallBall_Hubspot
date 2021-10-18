<?php

namespace App\Http\Controllers\API\GoogleDataStudio;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\UserDataSource;
use App\Models\Annotation;

class AnnotationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_google_data_studio) {
            abort(402);
        }

        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => []];
        }

        $this->authorize('viewAny', Annotation::class);

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";

        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";
        $annotationsQuery .= " WHERE DATE(`show_at`) BETWEEN '" . $request->query('startDate') . "' AND '" . $request->query('endDate') . "'";

        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
    }
}
