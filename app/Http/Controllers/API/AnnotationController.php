<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Http\Resources\annotation as annotationResource;
use App\Models\Annotation;
use App\Models\GoogleAlgorithmUpdate;
use Auth;
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
        $annotations = Annotation::where('user_id', Auth::id())->get();
        $resource = new annotationResource($annotations);
        return ['annotations' => $resource];
    }

    public function show(Annotation $annotation)
    {
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

        $annotationsQuery = Annotation::select('show_at', 'annotations.id', 'category', 'event_name', 'url', 'description')->where('user_id', Auth::id())->where('is_enabled', true);
        if ($request->query('google_account_id') && $request->query('google_account_id') !== '*') {
            $annotationsQuery->where('google_account_id', $request->query('google_account_id'));
        }

        if ($request->query('show_google_algorithm_updates') == 'true') {
            $annotationsQuery->union(GoogleAlgorithmUpdate::selectRaw('update_date AS show_at, google_algorithm_updates.id, category, event_name, NULL as url, description')
                ->whereRaw("DATE(`update_date`) >= '" . $request->query('startDate') . "' AND DATE(`update_date`) <= '" . $request->query('endDate') . "'"));
        }
        if ($request->query('show_holidays') == 'true') {
            $annotationsQuery->union(Holiday::selectRaw('holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description')
                ->join('user_data_sources AS uds', 'uds.country_name', 'holidays.country_name')
                ->where('uds.user_id', Auth::id())
                ->where('uds.ds_code', 'holidays')
                ->whereRaw("DATE(`holiday_date`) >= '" . $request->query('startDate') . "' AND DATE(`holiday_date`) <= '" . $request->query('endDate') . "'"));
        }

        $annotationsQuery->whereRaw("DATE(`show_at`) BETWEEN '" . $request->query('startDate') . "' AND '" . $request->query('endDate') . "'")->orderBy('show_at', 'ASC');
        $annotations = $annotationsQuery->get();

        if (!count($annotations)) {
            return ['annotations' => [[[]]]];
        }

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

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
        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->user_id = Auth::id();
        $annotation->save();

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
        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->save();

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
        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->delete();
        return ['success' => true];
    }

}
