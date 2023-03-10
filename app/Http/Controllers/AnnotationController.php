<?php

namespace App\Http\Controllers;

use App\Events\NewCSVFileUploaded;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\ApplePodcastAnnotation;
use App\Models\GoogleAdsAnnotation;
use App\Models\GithubCommitAnnotation;
use App\Models\BitbucketCommitAnnotation;
use App\Models\TwitterTrackingAnnotation;
use App\Models\InstagramTrackingAnnotation;
use App\Models\FacebookTrackingAnnotation;
use App\Models\KeywordTrackingAnnotation;
use App\Models\WordpressUpdate;
use App\Models\GoogleAlert;
use App\Models\OpenWeatherMapAlert;
use App\Models\RetailMarketing;
use App\Models\UserDataSource;
use App\Models\Holiday;
use App\Models\ShopifyAnnotation;
use App\Models\GoogleAlgorithmUpdate;
use App\Models\WebMonitorAnnotation;
use App\Models\AnnotationGaProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\GoogleAnalyticsProperty;
use App\Models\PricePlan;
use App\Providers\RouteServiceProvider;
use App\Helpers\AnnotationQueryHelper;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Annotation::class);

        return view('ui/app');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function create()
    {
        $this->authorize('create', Annotation::class);

        return view('ui/app');
    }

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);
        $user = Auth::user();

        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "Please upgrade your plan to add more annotations");
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
                            // There are 2 different messages to send for different price plan users.
                            if ($user->pricePlan->name == PricePlan::PRO) abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . RouteServiceProvider::PRODUCT_WEBSITE_PRICE_PLAN_PAGE . '" target="_blank" >Contact sales to upgrade your plan.</a>');
                            abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . route('settings.price-plans') . '" target="_blank" >Upgrade your plan.</a>');
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

        event(new \App\Events\AnnotationCreated($annotation));
        return ['annotation' => $annotation];
    }

    public function show($id)
    {
        return view('ui/app');
    }

    public function edit($id)
    {
        return view('ui/app');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function update(AnnotationRequest $request, Annotation $annotation)
    {
        $this->authorize('update', $annotation);

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(404, "Unable to find annotation with the given id.");
        }

        DB::beginTransaction();
        $annotation->fill($request->validated());
        if ($request->description == 'null') {
            $annotation->description = null;
        }
        $annotation->save();

        $aGAPs = $annotation->annotationGaProperties;
        $oldGAPIds = $aGAPs->pluck('google_analytics_property_id')->toArray();
        $newGAPIds = $request->google_analytics_property_id;

        if ($request->has('google_analytics_property_id')) {
            foreach ($aGAPs as $aGAP) {
                if (!in_array($aGAP->google_analytics_property_id, $newGAPIds)) {
                    $aGAP->delete();
                }
            }
        }

        if ($request->has('google_analytics_property_id')) {
            // Check if google analytics property ids are provided in the request
            if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
                // Fetch current user google analytics property ids in an array for validation
                $googleAnalyticsPropertyIds = GoogleAnalyticsProperty::ofCurrentUser()->get()->pluck('id')->toArray();

                foreach ($newGAPIds as $gAPId) {
                    // Add record only if the mentioned google analytics property id belongs to current user
                    if (in_array($gAPId, $googleAnalyticsPropertyIds)) {

                        if (!in_array($gAPId, $oldGAPIds)) {
                            $googleAnalyticsProperty = GoogleAnalyticsProperty::find($gAPId);
                            if (!$googleAnalyticsProperty->is_in_use) {
                                if ($user->isPricePlanGoogleAnalyticsPropertyLimitReached()) {
                                    DB::rollback();
                                    // There are 2 different messages to send for different price plan users.
                                    if ($user->pricePlan->name == PricePlan::PRO) abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . RouteServiceProvider::PRODUCT_WEBSITE_PRICE_PLAN_PAGE . '" target="_blank" >Contact sales to upgrade your plan.</a>');
                                    abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . route('settings.price-plans') . '" target="_blank" >Upgrade your plan.</a>');
                                }
                            }
                            $googleAnalyticsProperty->is_in_use = true;
                            $googleAnalyticsProperty->save();

                            $aGAP = new AnnotationGaProperty;
                            $aGAP->annotation_id = $annotation->id;
                            $aGAP->google_analytics_property_id = $gAPId;
                            $aGAP->user_id = $user->id;
                            $aGAP->save();
                        }
                    }
                }
            } else {
                if (!in_array("", $oldGAPIds)) {
                    $aGAP = new AnnotationGaProperty;
                    $aGAP->annotation_id = $annotation->id;
                    $aGAP->google_analytics_property_id = null;
                    $aGAP->user_id = $user->id;
                    $aGAP->save();
                }
            }
        }
        DB::commit();

        $annotation->load('annotationGaProperties');

        return ['annotation' => $annotation];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annotation $annotation)
    {
        $this->authorize('delete', $annotation);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(404, "Unable to find annotation with the given id.");
        }

        $annotation->delete();

        return ["success" => true];
    }

    public function uiIndex(Request $request)
    {
        $this->authorize('viewAny', Annotation::class);

        $this->validate($request, [
            'annotation_ga_property_id' => 'nullable|string',
            'category' => 'nullable|string',
            'search' => 'nullable|string',
            'sort_by' => 'nullable|string|in:added,user,date,category,added-by,today,ga-property',
            'page_size' => 'nullable|numeric|min:1|max:100',
            'page_number' => 'nullable|numeric|min:1',
        ]);

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id') ? $request->query('annotation_ga_property_id') : '*', $userIdsArray, '*', true);
        $annotationsQuery .= ") AS TempTable";

        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // LEFT JOINs to load all property details which are loaded from above statement
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";
        // All where clauses should reside here
        $whereClauses = [];
        // Apply category filter if it is added in GET request query parameter
        if ($request->query('cateogry') && $request->query('cateogry') !== '') {

            $whereClauses[] = "category = '" . $request->query('cateogry') . "'";
        }
        // Apply google analytics property filter if the value for filter is provided
        if ($request->query('annotation_ga_property_id') && $request->query('annotation_ga_property_id') !== '*') {
            $whereClauses[] = "annotation_ga_properties.google_analytics_property_id = '" . $request->query('annotation_ga_property_id') . "'";
            // $whereClauses[] = "(annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $request->query('annotation_ga_property_id') . ") ";
        }
        // Apply search functionality if search keyword is given
        if ($request->has('search') && $request->query('search') !== '') {
            $search = $request->query('search');
            $whereClauses[] = "(`category` LIKE '%$search%' OR `event_name` LIKE '%$search%' OR `description` LIKE '%$search%')";
        }
        if (count($whereClauses)) $annotationsQuery .= " WHERE " . implode(' AND ', $whereClauses);

        // Apply sort of provided column if it is added in GET request query parameter
        if ($request->query('sort_by') == "added") {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sort_by') == "date") {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        } elseif ($request->query('ga-property')) {
            $annotationsQuery .= " ORDER BY TempTable.annotation_ga_property_id ASC";
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sort_by') == "category") {
            $annotationsQuery .= " ORDER BY TempTable.category ASC, TempTable.created_at DESC";
        } elseif ($request->query('sort_by') == "added-by") {
            $annotationsQuery .= " ORDER BY TempTable.added_by ASC";
        } elseif ($request->query('sort_by') == "user") {
            $annotationsQuery .= " ORDER BY TempTable.user_name ASC";
        } elseif ($request->query('sort_by') == "today") {
            $annotationsQuery .= " ORDER BY DATE(TempTable.created_at)=DATE(NOW()) DESC";
        } else {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        }

        $limit = $request->has('page_size') ? $request->query('page_size') : 10;
        $offset = $request->has('page_number') ? $limit * ($request->query('page_number') - 1) : 1;

        // Add limit for annotations if the price plan is limited in annotations count
        $annotations_count = $user->pricePlan->annotations_count;
        if ($annotations_count > 0 && $annotations_count < $offset + $limit) {
            $limit = $annotations_count - $offset;
        }
        if ($annotations_count && ($offset - $annotations_count > $limit || $limit < 0)) {
            $limit = 0;
        }
        $annotationsQuery .= " LIMIT $limit OFFSET $offset";
        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations, 'query' => $annotationsQuery];
    }
    public function uiShow(Annotation $annotation)
    {
        $this->authorize('view', $annotation);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(404, "Unable to find annotation with the given id.");
        }

        $annotation->load('annotationGaProperties.googleAnalyticsProperty');
        return ['annotation' => $annotation];
    }

    public function saveCSV (Request $request) {

        $user_id = Auth::id();
        $fieldErrors = json_decode($request->fieldErrors, true);

        $data = [];
        $error = false;

        $dateF = $request->date_format;
        $dateFormat = '';
        switch ($dateF) {
        case 'MMM D, YYYY':
            $dateFormat = 'M j, Y';
            break;
        case 'D/MM/YYYY':
            $dateFormat = "j/n/Y";
            break;
        case 'M-D-YYYY':
            $dateFormat = "n-j-Y";
            break;
        case "M-D-YY":
            $dateFormat = "n-j-y";
            break;
        case "MM-D-YY":
            $dateFormat = "m-j-y";
            break;
        case "MM-D-YYYY":
            $dateFormat = "m-j-Y";
            break;
        case "YY-MM-D":
            $dateFormat = "y-m-j";
            break;
        case "YYYY-MM-D":
            $dateFormat = "Y-m-j";
            break;
        case "D-MMM-YY":
            $dateFormat = "j-M-y";
            break;
        case "M/D/YYYY":
            $dateFormat = "n/j/Y";
            break;
        case "M/D/YY":
            $dateFormat = "n/j/y";
            break;
        case "MM/D/YY":
            $dateFormat = "m/j/y";
            break;
        case "MM/D/YYYY":
            $dateFormat = "m/j/Y";
            break;
        case "YY/MM/D":
            $dateFormat = "y/m/j";
            break;
        case "YYYY/MM/D":
            $dateFormat = "Y/m/j";
            break;
        case "D/MMM/YY":
            $dateFormat = "j/M/y";
            break;

        default:
            $dateFormat = '';
        }

        $e = [];
        $fieldErrorsCount = 0;
        foreach ($fieldErrors as &$fe) {
            try {
                $showAt = Carbon::createFromFormat($dateFormat, $fe['show_at']);
                unset($fe['show_at_error']);
            } catch(\Exception $e) {
                if($fe['show_at']) {
                    $error = true;
                    $fieldErrorsCount++;
                    $fe['show_at_error'] = "Date format is incorrect, use format [" . Carbon::createFromDate(2021, 01, 15)->format($dateFormat) . "]";
                } else {
                    unset($fe['show_at_error']);
                }
            }

            if(!$fe['category']) {
                $error = true;
                $fieldErrorsCount++;
                $fe['category_error'] = "Category can't be empty";
            } else {
                unset($fe['category_error']);
            }

            if($fe['url'] && !filter_var($fe['url'], FILTER_VALIDATE_URL)) {
                $error = true;
                $fieldErrorsCount++;
                $fe['url_error'] = "Enter a valid URL";
            } else {
                unset($fe['url_error']);
            }

            if(!$fe['event_name']) {
                $error = true;
                $fieldErrorsCount++;
                $fe['event_name_error'] = "Event Name can't be empty";
            } else {
                unset($fe['event_name_error']);
            }

        }

        if ($error) {
            return ['success' => false, 'error' => $e, 'fieldErrors' => $fieldErrors, 'fieldErrorsCount' => $fieldErrorsCount, 'message' => "The date is not properly formatted"];
        }

        foreach ($fieldErrors as &$fe) {
            $showAt = $fe['show_at'] ? Carbon::createFromFormat($dateFormat, $fe['show_at']) : null;
            $exists = Annotation::where('user_id', $user_id)
                ->where('category', $fe['category'])
                ->where('event_name', $fe['event_name'])
                ->where('description', $fe['description'])
                ->when($showAt, function ($query) use ($showAt) {
                    $query->whereDate('show_at', $showAt);
                })
                ->where('url', $fe['url'])->first();
            $fe['show_at'] = $showAt ? $showAt : Carbon::now();
            $fe['user_id'] = $user_id;
            $fe['added_by'] = 'csv-upload';
            $fe['created_at'] = Carbon::now();

            if(!$exists) {
                foreach($data as $dt) {
                    $exists = $dt['description'] === $fe['description'] && $dt['event_name'] === $fe['event_name'] && $dt['category'] === $fe['category'] && $dt['url'] === $fe['url'];
                }
            }

            if(!$exists) {
                $data[] = $fe;
            }
        }

        $resp = $this->insertRows($data, $request);
        if ($resp === 'ok') {
            return ['success' => true];
        } else {
            return ['success' => false, 'error' => $resp];
        }

    }

    public function upload(Request $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "Please upgrade your plan to add more annotations.");
        }
        if (!$user->pricePlan->has_csv_upload) {
            abort(402, "Please upgrade your plan to use CSV upload feature.");
        }

        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/csv,text/plain,text/html|mimes:csv,txt,html',
            'google_analytics_property_id' => 'nullable|array',
            'google_analytics_property_id.*' => 'nullable|exists:google_analytics_properties,id',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);


        $importReview = [];
        $importReviewErrorCount = 0;

        // Checking if given file contains all required headers
        $kHs = ['category', 'event_name', 'url', 'description', 'show_at'];
        foreach ($kHs as $kH) {
            if (!in_array($kH, $headers)) {
                $importReviewErrorCount = $importReviewErrorCount + 1;
                $importReview[$kH . "_error"] = 'Incomplete CSV file headers';
            }
        }

        $rows = array();
        try {

            $sampleDate = '';
            foreach ($filecontent as $line) {
                if (strlen($line) < (6 + 7)) {
                    continue;
                }

                $row = array();
                $values = str_getcsv($line);

                if ($headers !== $values && count($values) == count($headers)) {
                    for ($i = 0; $i < count($headers); $i++) {
                        if ($headers[$i] == 'show_at' && !$sampleDate) {
                            $sampleDate = $values[$i];
                        }

                        if ($headers[$i] == 'url') {
                            $row[$headers[$i]] = $values[$i];
                        } else {
                            $column = trim(str_replace('"', "", $headers[$i]));
                            $validStr = mb_convert_encoding($values[$i], 'UTF-8', 'UTF-8');
                            $row[$column] = $validStr;
                            if ($validStr !== $values[$i]) {
                                $row[$column . "_error"] = "Please enter a valid value";
                            }
                            // $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                        }
                    }

                    array_push($rows, $row);
                }

            }

        } catch (\Exception $e) {
            Log::error($e);
            abort(422, "Error occured while processing your CSV. Please contact support for more information.");
        }

        return [
            'fieldErrors'=> $rows,
            'fileName' => $request->file('csv')->getClientOriginalName(),
            'sampleDate' => $sampleDate,
            'importReview'=> $importReview,
            'importReviewErrorCount' => $importReviewErrorCount,
            'fileHeaders' => $headers
        ];
    }

    public function insertRows ($rows, $request) {
        try {
            Annotation::insert($rows);
            $firstInsertId = DB::getPdo()->lastInsertId(); // it returns first generated ID in bulk insert
            $totalNewRows = count($rows);
            $lastInsertId = $firstInsertId + ($totalNewRows - 1);
            if ($request->has('google_analytics_property_id') && !in_array("", $request->google_analytics_property_id)) {
                foreach ($request->google_analytics_property_id as $googleAnalyticsPropertyId) {
                    $sql = "
                    INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                        SELECT id, $googleAnalyticsPropertyId, user_id FROM annotations
                            WHERE id BETWEEN $firstInsertId AND $lastInsertId
                    ;
                    ";
                    DB::statement($sql);
                }
            } else {
                $sql = "
                    INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                        SELECT id, NULL, user_id FROM annotations
                            WHERE id BETWEEN $firstInsertId AND $lastInsertId
                    ;
                    ";
                DB::statement($sql);
            }

            $user = Auth::user();
            event(new NewCSVFileUploaded($user, $request->fileName));
            return 'ok';
        } catch (\Exception $e) {
            dd($e);
            return $e;
        }

    }

    public function getCategories()
    {

        $this->authorize('viewAny', Annotation::class);

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT DISTINCT `TempTable`.`category` FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, '*', $userIdsArray, '*', true);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY category";

        $categories = DB::select($annotationsQuery);
        return ['categories' => $categories];
    }

    public function delete_annotations(Request $request)
    {
        $request->validate([
            'annotation_id' => 'required',
            'table_name' => 'required',
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        if ($request->table_name == 'annotations') {
            // working fine
            $annotation = Annotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'google_algorithm_updates') {
            // working fine
            $annotation = GoogleAlgorithmUpdate::find($request->annotation_id);
            $annotation->delete();
        } else if ($request->table_name == 'web_monitor_annotations') {
            $annotation = WebMonitorAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'shopify_annotations') {
            $annotation = ShopifyAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'holidays') {
            // working fine
            $annotation = Holiday::find($request->annotation_id);
            $annotation->delete();
        } else if ($request->table_name == 'retail_marketings') {
            // working fine
            // Retrieve the RetailMarketing record
            $retailMarketing = RetailMarketing::find($request->annotation_id);

            // Check if the RetailMarketing record exists
            if (!$retailMarketing) {
                return response()->json(['message' => 'RetailMarketing record not found'], 404);
            }

            if ($retailMarketing) {
                UserDataSource::where('retail_marketing_id', $retailMarketing->id)->delete();
            }

            // Delete the RetailMarketing record
            $retailMarketing->delete();

        } else if ($request->table_name == 'open_weather_map_alerts') {
            // working fine
            $annotation = OpenWeatherMapAlert::find($request->annotation_id);
            $annotation->delete();
        } else if ($request->table_name == 'google_alerts') {
            $annotation = GoogleAlert::find($request->annotation_id);
            $annotation->delete();
        } else if ($request->table_name == 'wordpress_updates') {
            $annotation = WordpressUpdate::find($request->annotation_id);

            $annotation->delete();
        } else if ($request->table_name == 'keyword_tracking_annotations') {
            $annotation = KeywordTrackingAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'facebook_tracking_annotations') {
            $annotation = FacebookTrackingAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'instagram_tracking_annotations') {
            $annotation = InstagramTrackingAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'twitter_tracking_annotations') {
            $annotation = TwitterTrackingAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'bitbucket_commit_annotations') {
            $annotation = BitbucketCommitAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'github_commit_annotations') {
            $annotation = GithubCommitAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'google_ads_annotations') {
            $annotation = GoogleAdsAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        } else if ($request->table_name == 'apple_podcast_annotations') {
            $annotation = ApplePodcastAnnotation::find($request->annotation_id);
            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }
            $annotation->delete();
        }


        return ["success" => true];
    }
    public function bulk_delete(Request $request)
    {
        $request->validate([
            'annotation_ids' => 'required',
        ]);

        foreach ($request->annotation_ids as $annotation_id) {
            $annotation = Annotation::find($annotation_id);

            $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

            if (!in_array($annotation->user_id, $userIdsArray)) {
                abort(404, "Unable to find annotation with the given id.");
            }

            $annotation->delete();
        }

        return ["success" => true];
    }

    public function user_total_annotations()
    {
        $annotations = Auth::user()->getTotalAnnotationsCount(1000000000000);
        return [
            'user_total_annotations' => $annotations,
        ];
    }
}
