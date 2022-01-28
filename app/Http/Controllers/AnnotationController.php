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

        if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
            foreach ($request->google_analytics_property_id as $gAPId) {
                $googleAnalyticsProperty = GoogleAnalyticsProperty::find($gAPId);
                if (!$googleAnalyticsProperty->is_in_use) {
                    if ($user->isPricePlanGoogleAnalyticsPropertyLimitReached()) {
                        DB::rollback();
                        abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . route('settings.price-plans') . '">Upgrade your plan.</a>');
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
            if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
                foreach ($newGAPIds as $gAPId) {
                    if (!in_array($gAPId, $oldGAPIds)) {
                        $googleAnalyticsProperty = GoogleAnalyticsProperty::find($gAPId);
                        if (!$googleAnalyticsProperty->is_in_use) {
                            if ($user->isPricePlanGoogleAnalyticsPropertyLimitReached()) {
                                DB::rollback();
                                abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . route('settings.price-plans') . '">Upgrade your plan.</a>');
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

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";

        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // LEFT JOINs to load all property details which are loaded from above statement
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";

        // Apply category filter if it is added in GET request query parameter
        if ($request->query('category') && $request->query('category') !== '') {
            $annotationsQuery .= " WHERE category = '" . $request->query('category') . "'";
        }

        // Apply sort of provided column if it is added in GET request query parameter
        if ($request->query('sortBy') == "added") {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "date") {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "category") {
            $annotationsQuery .= " ORDER BY TempTable.category ASC";
        } elseif ($request->query('sortBy') == "added-by") {
            $annotationsQuery .= " ORDER BY TempTable.added_by ASC";
        } else {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        }
        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
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
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
            'date_format' => 'required',
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

        // Checking if given file contains all required headers
        $kHs = ['category', 'event_name', 'url', 'description', 'show_at'];
        foreach ($kHs as $kH) {
            if (!in_array($kH, $headers)) {
                return response()->json(['message' => 'Incomplete CSV file headers'], 422);
            }
        }

        $user_id = Auth::id();

        $rows = array();
        try {

            DB::beginTransaction();
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
                                    DB::rollBack();
                                    return response()->json(['message' => "Please select correct date format according to your CSV file from the list below."], 422);
                                }
                            } else if ($headers[$i] == 'url') {
                                $row['url'] = $values[$i];
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
                    array_push($rows, $row);
                }

                if (count($rows) > 1000) {
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

                    $rows = array();
                }
            }

            if (count($rows)) {
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
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            abort(422, "Error occured while processing your CSV. Please contact support for more information.");
        }
        event(new NewCSVFileUploaded($user, $request->file('csv')->getClientOriginalName()));

        return ['success' => true];
    }

    public function getCategories()
    {

        $this->authorize('viewAny', Annotation::class);

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT DISTINCT `TempTable`.`category` FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, '*', $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY category";

        $categories = DB::select($annotationsQuery);
        return ['categories' => $categories];
    }
}
