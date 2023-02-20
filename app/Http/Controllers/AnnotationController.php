<?php

namespace App\Http\Controllers;

use App\Events\NewCSVFileUploaded;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
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
            'sort_by' => 'nullable|string|in:added,date,category,added-by,ga-property',
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
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sort_by') == "category") {
            $annotationsQuery .= " ORDER BY TempTable.category ASC";
        } elseif ($request->query('sort_by') == "added-by") {
            $annotationsQuery .= " ORDER BY TempTable.added_by ASC";
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

        $reviewData = json_decode($request->reviewData);
        $format = $request->date_format;

        $error = false;
        $totalErrors = 0;
        foreach($reviewData as $dt) {

            try {
                $date = Carbon::createFromFormat($format, $dt->show_at);
                $dt->show_at = $date->format('Y-m-d');
            } catch (\Exception $e) {
                $dt->show_at = $dt->show_at;
                $dt->show_at_error = 'Please select correct date format according to your CSV file from the list below.';
                $error = true;
                $totalErrors = $totalErrors + 1;
            }

            if (!filter_var($dt->url, FILTER_VALIDATE_URL)) {
                $dt->url_error = 'Please provide valid url';
                $error = true;
                $totalErrors = $totalErrors + 1;
            }

        }

        if ($error) {
            return ['success' => false, 'data'=> $reviewData, 'totalErrors' => $totalErrors];
        } else {
            $this->insertRows($reviewData, $request);
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

        // Checking if given file contains only required number of columns
        // if (count($headers) !== 5) {
        //     return response()->json(['message' => 'Invalid number of columns'], 422);
        // }

        // Checking if given headers contain non-printable  characters
        foreach ($headers as $header) {
            if (!ctype_print($header)) {
                return response()->json(['message' => "Inappropriate character in header: " . json_encode($header)], 422);
            }
        }

        // Checking if given file contains all required headers
        $kHs = ['category', 'event_name', 'url', 'description', 'show_at'];
        foreach ($kHs as $kH) {
            if (!in_array($kH, $headers)) {
                return response()->json(['message' => "Incomplete CSV file headers.\nMissing header '" . $kH . "'.\nReceived headers: " . json_encode($headers)], 422);
            }
        }

        $user_id = Auth::id();

        $existingRecords = Annotation::where('user_id', $user_id)->get();

        $rows = array();
        try {

            $error = false;
            $totalErrors = 0;
            foreach ($filecontent as $line) {
                if (strlen($line) < (6 + 7)) {
                    continue;
                }

                $row = array();
                $values = str_getcsv($line);

                if ($headers !== $values && count($values) == count($headers)) {
                    for ($i = 0; $i < count($headers); $i++) {
                        if (in_array($headers[$i], $kHs)) {
                            if ($headers[$i] == 'show_at') {
                                try {
                                    $date = Carbon::createFromFormat($request->date_format, $values[$i]);
                                    $row['show_at'] = $date->format('Y-m-d');
                                } catch (\Exception $e) {
                                    $row['show_at'] = $values[$i];
                                    $row['show_at_error'] = 'Please select correct date format according to your CSV file from the list below.';
                                    $error = true;
                                    $totalErrors = $totalErrors + 1;
                                }
                            } else if ($headers[$i] == 'url') {
                                $url = $values[$i];
                                $row['url'] = $url;
                                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                    $row['url_error'] = 'Please provide valid url';
                                    $error = true;
                                    $totalErrors = $totalErrors + 1;
                                }
                            } else if ($headers[$i] == 'category') {
                                $row['category'] = strlen($values[$i]) > 100 ? Str::limit($values[$i], 97) : $values[$i];
                            } else if ($headers[$i] == 'event_type') {
                                $row['event_type'] = strlen($values[$i]) > 100 ? Str::limit($values[$i], 97) : $values[$i];
                            } else if ($headers[$i] == 'event_name') {
                                $row['event_name'] = strlen($values[$i]) > 100 ? Str::limit($values[$i], 97) : $values[$i];
                            } else if ($headers[$i] == 'title') {
                                $row['title'] = strlen($values[$i]) > 100 ? Str::limit($values[$i], 97) : $values[$i];
                            } else {
                                $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                            }
                        }
                    }

                    $row['user_id'] = $user_id;
                    $row['added_by'] = 'csv-upload';
                    // if ($this->isNotDuplicate($existingRecords, $row)) {
                        array_push($rows, $row);
                    // }
                }

                if (count($rows) > 9000) {
                    // formula for ^ number is max no. of placeholders in mysql (65535) / no. of columns you have in insert statement (7)
                    // I obviously rounded it to something human readable
                    $this->insertRows($rows, $request);
                    $rows = array();
                }
            }

            if (count($rows) && !$error) {
                $this->insertRows($rows, $request);
                event(new NewCSVFileUploaded($user, $request->file('csv')->getClientOriginalName()));
            }
        } catch (\Exception $e) {
            Log::error($e);
            abort(422, "Error occured while processing your CSV. Please contact support for more information.");
        }

        return ['success' => !$error, 'data'=> $rows, 'totalErrors' => $totalErrors];
    }

    public function isNotDuplicate ($existingRecords, $row) {



    }

    public function insertRows ($rows, $request) {
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
