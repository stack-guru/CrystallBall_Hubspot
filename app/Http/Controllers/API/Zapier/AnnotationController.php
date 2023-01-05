<?php

namespace App\Http\Controllers\API\Zapier;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\GoogleAnalyticsProperty;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Helpers\AnnotationQueryHelper;

class AnnotationController extends Controller
{

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "Please upgrade your plan to add more annotations");
        }
        $userId = $user->id;

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = $userId;
        $annotation->is_enabled = true;
        $annotation->added_by = 'zapier';
        $annotation->save();
        event(new \App\Events\AnnotationCreated($annotation));

        // Check if google analytics property ids are provided in the request
        if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
            // Fetch current user google analytics property ids in an array for validation
            $googleAnalyticsPropertyIds = GoogleAnalyticsProperty::ofCurrentUser()->get()->pluck('id')->toArray();

            foreach ($request->google_analytics_property_id as $gAPId) {
                // Add record only if the mentioned google analytics property id belongs to current user
                if (in_array($gAPId, $googleAnalyticsPropertyIds)) {
                    $aGAP = new AnnotationGaProperty;
                    $aGAP->annotation_id = $annotation->id;
                    $aGAP->google_analytics_property_id = $gAPId;
                    $aGAP->user_id = $userId;
                    $aGAP->save();
                }
            }
        } else {
            $aGAP = new AnnotationGaProperty;
            $aGAP->annotation_id = $annotation->id;
            $aGAP->google_analytics_property_id = null;
            $aGAP->user_id = $userId;
            $aGAP->save();
        }

        $annotation->created_at = Carbon::parse($annotation->created_at)->toIso8601String();
        $annotation->updated_at = Carbon::parse($annotation->updated_at)->toIso8601String();
        $annotation->show_at = Carbon::parse($annotation->show_at)->toIso8601String();

        return ['annotation' => $annotation];
    }

    public function index(Request $request)
    {

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT TempTable.* FROM (";

        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= AnnotationQueryHelper::userAnnotationsQuery(
            $user,
            $userIdsArray,
            $request->query('google_analytics_property_id'),
            $request->query('user_id'),
            $request->query('show_website_monitoring'),
            $request->query('show_manual_annotations'),
            $request->query('show_csv_annotations'),
            $request->query('show_api_annotations')
        );
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_algorithm_updates_enabled && $request->query('show_google_algorithm_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::googleAlgorithmQuery($user);
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_web_monitors_enabled && $request->query('show_website_monitoring') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::webMonitorQuery($userIdsArray);
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_holidays_enabled && $request->query('show_holidays') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::holidaysQuery($user, $request->query('google_analytics_property_id'));
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_retail_marketing_enabled && $request->query('show_retail_marketing_dates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::retailMarketingQuery($user, $request->query('google_analytics_property_id'));
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_weather_alerts_enabled && $request->query('show_weather_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::openWeatherMapQuery($user, $request->query('google_analytics_property_id'));
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_alerts_enabled && $request->query('show_news_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::googleAlertsQuery($user, $request->query('google_analytics_property_id'));
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_wordpress_updates_enabled && $request->query('show_wordpress_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::wordPressQuery();
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_g_ads_history_change_enabled  && $request->query('show_g_ads_history_change_enabled') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= AnnotationQueryHelper::googleAdsQuery($userIdsArray);
        }
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable ORDER BY show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        $annotations = array_map(function ($a) {
            $a->show_at = Carbon::parse($a->show_at)->toIso8601String();
            return $a;
        }, $annotations);

        return $annotations;
    }
}
