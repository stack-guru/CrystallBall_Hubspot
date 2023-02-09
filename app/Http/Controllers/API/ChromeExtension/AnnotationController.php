<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\GoogleAnalyticsProperty;
use App\Models\PricePlan;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\ChromeExtensionLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Helpers\AnnotationQueryHelper;

class AnnotationController extends Controller
{

    public function index(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => [[[]]]];
        }

        $this->validate($request, [
            'startDate' => 'bail|required|date',
            'endDate' => 'bail|required|date',
            // Need to accept *
            // 'google_analytics_property_id' => 'bail|nullable|numeric|exists:google_analytics_properties,id',

            // Need to accept *
            // 'user_id' => 'bail|nullable|numeric|exists:users,id',
        ]);

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";

        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString(
            $user,
            $request->query('google_analytics_property_id') ? $request->query('google_analytics_property_id') : '*',
            $userIdsArray,
            $request->query('user_id') ? $request->query('user_id') : 'false',
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
            $request->query('show_intagram_tracking') ? $request->query('show_intagram_tracking') : 'false',
            $request->query('show_twitter_tracking') ? $request->query('show_twitter_tracking') : 'false',
            $request->query('show_g_ads_history_change_enabled') ? $request->query('show_g_ads_history_change_enabled') : 'false',
            $request->query('show_bitbucket_tracking') ? $request->query('show_bitbucket_tracking') : 'false',
            $request->query('show_github_tracking') ? $request->query('show_github_tracking') : 'false',
            $request->query('show_apple_podcast_annotations') ? $request->query('show_apple_podcast_annotations') : 'false'
        );

        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        if (!count($annotations)) {
            return ['annotations' => [[[]]]];
        }

        $fAnnotations = [];

        // If start date is not same as first annotation show date
        // then add blank records to reach the starting point of annotation show date
        $showDate = Carbon::parse($annotations[0]->show_at);
        if ($showDate !== $startDate) {
            $nextShowDate = $startDate;
            $blankCount = $startDate->diffInDays($showDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        $combineAnnotations = [];
        // Iterating through all annotations and generate an array
        for ($i = 0; $i < count($annotations); $i++) {
            $showDate = Carbon::parse($annotations[$i]->show_at);

            // If current annotation is not last annotation
            if ($i != count($annotations) - 1) {
                // If current and next annotation is of same date
                if ($annotations[$i]->show_at == $annotations[$i + 1]->show_at) {
                    // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                    if (!$user->pricePlan->has_chrome_extension && count($combineAnnotations)) {
                    } else {
                        array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                    }
                    // keep adding annotations in combinedAnnotations array if next annotation
                    // is of same date
                    continue;
                } else {
                    // If current and next annotation is of different date

                    // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                    if (!$user->pricePlan->has_chrome_extension && count($combineAnnotations)) {
                    } else {
                        array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                    }
                }
            } else {
                // If current annotation is last annotation

                // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                if (!$user->pricePlan->has_chrome_extension && count($combineAnnotations)) {
                } else {
                    array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                }
            }
            array_push($fAnnotations, [$combineAnnotations]);
            $combineAnnotations = [];

            // Check if last record or not
            if (($i + 1) !== count($annotations)) {
                $nextShowDate = Carbon::parse($annotations[$i + 1]->show_at);

                // Fill with blank records according to the difference of days between two consecutive annotations
                $blankCount = $showDate->diffInDays($nextShowDate) - 1;
                for ($j = 0; $j < $blankCount; $j++) {
                    array_push($fAnnotations, [[]]);
                }
            }
        }

        $showDate = Carbon::parse($annotations[count($annotations) - 1]->show_at);
        // If annotations are not ending on the request end date then add blank records for
        // each date till end date
        if ($showDate !== $endDate) {
            $nextShowDate = $endDate;
            $blankCount = $showDate->diffInDays($nextShowDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        return [
            'annotations' => $fAnnotations,
            'user_annotation_color' => $user->userAnnotationColor,
        ];
    }

    //another method is used to show annotations with selected date(same as method defined above)

    public function extensionAnnotationPreview(Request $request)
    {
        $this->validate($request, [
            'startDate' => 'required',
            'endDate' => 'required',

            'pageNumber' => 'nullable|numeric|required_with:pageSize|min:1',
            'pageSize' => 'nullable|numeric|required_with:pageNumber|min:1|max:100',
        ]);

        $user = Auth::user();
        if (!$user->pricePlan->has_chrome_extension) {
            return [
                'annotations' => [
                    [
                        "category" => "Upgrade your plan",
                        "event_name" => "To see the annotations",
                        "show_at" => Carbon::now()->format('Y-m-d')
                    ]
                ],
                'user_annotation_color' => $user->userAnnotationColor,
            ];
        }
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.category, TempTable.event_name, TempTable.show_at, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";

        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString(
            $user,
            $request->query('google_analytics_property_id') ? $request->query('google_analytics_property_id') : '*',
            $userIdsArray,
            $request->query('user_id') ? $request->query('user_id') : 'false',
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
            $request->query('show_intagram_tracking') ? $request->query('show_intagram_tracking') : 'false',
            $request->query('show_twitter_tracking') ? $request->query('show_twitter_tracking') : 'false',
            $request->query('show_g_ads_history_change_enabled') ? $request->query('show_g_ads_history_change_enabled') : 'false',
            $request->query('show_bitbucket_tracking') ? $request->query('show_bitbucket_tracking') : 'false',
            $request->query('show_github_tracking') ? $request->query('show_github_tracking') : 'false',
            $request->query('show_apple_podcast_annotations') ? $request->query('show_apple_podcast_annotations') : 'false'
        );

        $annotationsQuery .= ") AS TempTable ";

        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // LEFT JOINs to load all property details which are loaded from above statement
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";

        $annotationsQuery .= " WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        } else {
            // Check if the user is requesting pagination
            if ($request->has('pageNumber') && $request->has('pageSize')) {
                $pageNumber = $request->pageNumber;
                $pageSize = $request->pageSize;

                $annotationsQuery .= " LIMIT " . ($pageSize * ($pageNumber - 1)) . ', ' . $pageSize;
            }
        }

        $annotations = DB::select($annotationsQuery);

        return [
            'annotations' => $annotations,
            'user_annotation_color' => $user->userAnnotationColor,
        ];
    }

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        if ((!$user->pricePlan->has_chrome_extension)) {
            abort(402, "Please upgrade your plan to use Chrome Extension.");
        }
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "You have reached the annotations plan's limit.\nPlease go to the dashboard to upgrade your plan.");
        }

        $userId = $user->id;


        DB::beginTransaction();
        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = $userId;
        $annotation->is_enabled = true;
        $annotation->added_by = 'manual';
        $annotation->save();

        // Check if google analytics property ids are provided in the request
        if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
            // Fetch current user google analytics property ids in an array for validation
            $googleAnalyticsPropertyIds = GoogleAnalyticsProperty::ofCurrentUser()->get()->pluck('id')->toArray();

            foreach ($request->google_analytics_property_id as $gAPId) {
                // Add record only if the mentioned google analytics property id belongs to current user
                if (in_array($gAPId, $googleAnalyticsPropertyIds)) {

                    $googleAnalyticsProperty = GoogleAnalyticsProperty::find($gAPId);
                    if (!$googleAnalyticsProperty->is_in_use) {
                        if ($user->isPricePlanGoogleAnalyticsPropertyLimitReached()) {
                            DB::rollback();
                            abort(402, "You have reached the properties plan's limit.\nPlease go to the dashboard to upgrade your plan.");
                        }
                    }
                    $googleAnalyticsProperty->is_in_use = true;
                    $googleAnalyticsProperty->save();

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
        DB::commit();

        $chromeExtensionOldLogsCount = ChromeExtensionLog::ofCurrentUser()
            ->where('event_name', ChromeExtensionLog::ANNOTATION_CREATED)
            ->count();
        $chromeExtensionLog = new ChromeExtensionLog;
        $chromeExtensionLog->event_name = ChromeExtensionLog::ANNOTATION_CREATED;

        $chromeExtensionLog->created_at = Carbon::now();
        $chromeExtensionLog->user_id = Auth::id();
        $chromeExtensionLog->ip_address = $request->ip();
        $chromeExtensionLog->bearer_token = $request->bearerToken();

        $chromeExtensionLog->save();

        if (!$chromeExtensionOldLogsCount) event(new \App\Events\ChromeExtensionFirstAnnotationCreated($user, $annotation));
        event(new \App\Events\AnnotationCreated($annotation));

        if (isset($annotation->user)) unset($annotation->user);
        return ['annotation' => $annotation];
    }

    private function formatAnnotation($annotation, $publishDate, $user): array
    {

        // Hiding annotations if user is not allowed to use chrome extension
        if (!$user->pricePlan->has_chrome_extension) {
            return [
                "_id" => $annotation->id,
                "category" => 'Upgrade your plan',
                "eventSource" => [
                    "type" => "annotation",
                    "name" => 'To see the annotation',
                ],
                "url" => route('settings.price-plans'),
                "description" => $user->pricePlan->name == PricePlan::TRIAL_ENDED ? 'The Chrome extension is not available after the Trial ends.' : 'The Chrome extension is not available in ' . $user->pricePlan->name . ' plan.',
                "title" => "Upgrade your plan",
                "highlighted" => false,
                "publishDate" => $publishDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                "type" => "private",
            ];
        } else {
            return [
                "_id" => $annotation->id,
                "category" => $annotation->category,
                "eventSource" => [
                    "type" => "annotation",
                    "name" => $annotation->event_name,
                ],
                "url" => $annotation->url,
                "description" => $annotation->description,
                "title" => "NA",
                "highlighted" => false,
                // "publishDate" => $publishDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                "publishDate" => $publishDate->format('Y-m-d'), //"2020-08-30
                "type" => "private",
            ];
        }
    }
}
