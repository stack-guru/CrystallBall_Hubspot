<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Http\Resources\annotation as annotationResource;
use App\Models\Annotation;
use App\Models\GoogleAlgorithmUpdate;
use Auth;
use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Holiday;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        if(! $user->pricePlan->has_api) abort(402);

        $annotations = Annotation::where('user_id', Auth::id())->get();
        $resource = new annotationResource($annotations);
        return ['annotations' => $resource];
    }

    public function show(Annotation $annotation)
    {
        $user = Auth::user();
        if(! $user->pricePlan->has_api) abort(402);

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        return ['annotation' => $annotation];
    }

    public function extensionIndex(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => [[[]]]];
        }

        $userId = Auth::id();
        $user = Auth::user();
        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";

        if ($request->query('google_analytics_account_id') && $request->query('google_analytics_account_id') !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_accounts` ON `annotation_ga_accounts`.`annotation_id` = `annotations`.`id`";
            $annotationsQuery .= " WHERE `annotation_ga_accounts`.`google_analytics_account_id` = " . $request->query('google_analytics_account_id') . " AND `annotations`.`user_id` = " . $userId . " AND `annotations`.`is_enabled` = 1";
        }else{
            $annotationsQuery .= " WHERE `annotations`.`user_id` = " . $userId . " AND `annotations`.`is_enabled` = 1";
        }

        if ($user->is_ds_google_algorithm_updates_enabled && $request->query('show_google_algorithm_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date AS show_at, google_algorithm_updates.id, category, event_name, NULL as url, description from `google_algorithm_updates`";
        }
        if ($user->is_ds_holidays_enabled && $request->query('show_holidays') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where `uds`.`user_id` = " . $userId . " and `uds`.`ds_code` = 'holidays'";
        }
        if ($user->is_ds_retail_marketing_enabled && $request->query('show_retail_marketing_dates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where `uds`.`user_id` = " . $userId . " and `uds`.`ds_code` = 'retail_marketings'";
        }

        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";
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
        for ($i = 0; $i < count($annotations); $i++) {
            $showDate = Carbon::parse($annotations[$i]->show_at);

            if ($i != count($annotations) - 1) {
                if ($annotations[$i]->show_at == $annotations[$i + 1]->show_at) {
                    array_push($combineAnnotations, [
                        "_id" => $annotations[$i]->id,
                        "category" => $annotations[$i]->category,
                        "eventSource" => [
                            "type" => 'annotation',
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => "NA",
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                    continue;
                } else {
                    array_push($combineAnnotations, [
                        "_id" => $annotations[$i]->id,
                        "category" => $annotations[$i]->category,
                        "eventSource" => [
                            "type" => "annotation",
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => "NA",
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                }
            } else {
                array_push($combineAnnotations, [
                    "_id" => $annotations[$i]->id,
                    "category" => $annotations[$i]->category,
                    "eventSource" => [
                        "type" => 'annotation',
                        "name" => $annotations[$i]->event_name,
                    ],
                    "url" => $annotations[$i]->url,
                    "description" => $annotations[$i]->description,
                    "title" => "NA",
                    "highlighted" => false,
                    "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                    "type" => "private",
                ]);
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
        if ($showDate !== $endDate) {
            $nextShowDate = $endDate;
            $blankCount = $showDate->diffInDays($nextShowDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        return ['annotations' => $fAnnotations];

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AnnotationRequest $request)
    {
        $user = Auth::user();
        $userId = $user->id;
        if(! $user->pricePlan->has_api) abort(402);

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->user_id = Auth::id();
        $annotation->added_by = 'api';
        $annotation->save();

        if (!in_array("", $request->google_analytics_account_id)) {
            foreach ($request->google_analytics_account_id as $gAAId) {
                $aGAA = new AnnotationGaAccount;
                $aGAA->annotation_id = $annotation->id;
                $aGAA->google_analytics_account_id = $gAAId;
                $aGAA->user_id = $userId;
                $aGAA->save();
            }
        } else {
            $aGAA = new AnnotationGaAccount;
            $aGAA->annotation_id = $annotation->id;
            $aGAA->google_analytics_account_id = null;
            $aGAA->user_id = $userId;
            $aGAA->save();
        }

        return ['annotation' => $annotation];
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
        $user = Auth::user();
        if(! $user->pricePlan->has_api) abort(402);

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->save();

        $aGAAs = $annotation->annotationGaAccounts;
        $oldGAAIds = $aGAAs->pluck('google_analytics_account_id')->toArray();
        $newGAAIds = $request->google_analytics_account_id;

        foreach ($aGAAs as $aGAA) {
            if (!in_array($aGAA->google_analytics_account_id, $newGAAIds)) {
                $aGAA->delete();
            }
        }

        if ($request->has('google_analytics_account_id')) {
            if (!in_array("", $request->google_analytics_account_id)) {
                foreach ($newGAAIds as $gAAId) {
                    if (!in_array($gAAId, $oldGAAIds)) {
                        $aGAA = new AnnotationGaAccount;
                        $aGAA->annotation_id = $annotation->id;
                        $aGAA->google_analytics_account_id = $gAAId;
                        $aGAA->user_id = $userId;
                        $aGAA->save();
                    }
                }
            } else {
                $aGAA = new AnnotationGaAccount;
                $aGAA->annotation_id = $annotation->id;
                $aGAA->google_analytics_account_id = null;
                $aGAA->user_id = $userId;
                $aGAA->save();
            }
        }

        $annotation->load('annotationGaAccounts');

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
        $user = Auth::user();
        if(! $user->pricePlan->has_api) abort(402);
        
        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->delete();
        return ['success' => true];
    }

}
