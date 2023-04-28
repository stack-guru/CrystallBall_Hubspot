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

        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString(
            $user,
            $request->query('google_analytics_property_id') ? $request->query('google_analytics_property_id') : '*',
            $userIdsArray,
            $request->query('user_id') ? $request->query('user_id') : '*',
            false,
            $request->query('show_manual_annotations') ? $request->query('show_manual_annotations') : 'false',
            $request->query('show_csv_annotations') ? $request->query('show_csv_annotations') : 'false',
            $request->query('show_api_annotations') ? $request->query('show_api_annotations') : 'false',
            $request->query('show_website_monitoring') ? $request->query('show_website_monitoring') : 'false',
            $request->query('show_holidays') ? $request->query('show_holidays') : 'false',
            $request->query('show_retail_marketing_dates') ? $request->query('show_retail_marketing_dates') : 'false',
            $request->query('show_weather_alerts') ? $request->query('show_weather_alerts') : 'false',
            $request->query('show_news_alerts') ? $request->query('show_news_alerts') : 'false',
            $request->query('show_google_algorithm_updates') ? $request->query('show_google_algorithm_updates') : 'false',
            $request->query('show_wordpress_updates') ? $request->query('show_wordpress_updates') : 'false',
            $request->query('show_keyword_tracking') ? $request->query('show_keyword_tracking') : 'false',
            $request->query('show_facebook_tracking') ? $request->query('show_facebook_tracking') : 'false',
            $request->query('show_instagram_tracking') ? $request->query('show_instagram_tracking') : 'false',
            $request->query('show_twitter_tracking') ? $request->query('show_twitter_tracking') : 'false',
            $request->query('show_g_ads_history_change_enabled') ? $request->query('show_g_ads_history_change_enabled') : 'false',
            $request->query('show_bitbucket_tracking') ? $request->query('show_bitbucket_tracking') : 'false',
            $request->query('show_github_tracking') ? $request->query('show_github_tracking') : 'false',
            $request->query('show_apple_podcast_annotations') ? $request->query('show_apple_podcast_annotations') : 'false'
        );

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
