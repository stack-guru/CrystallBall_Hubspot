<?php

namespace App\Http\Controllers;

use App\Annotation;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Auth;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('ui/app.blade.php');
    }

    public function apiIndex(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => [[[]]]];
        }

        $annotationsQuery = Annotation::where('user_id', Auth::id())->orderBy('show_at', 'ASC');
        $annotationsQuery->whereBetween('show_at', [$request->query('startDate'), $request->query('endDate')]);
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
                            "type" => $annotations[$i]->event_type,
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => $annotations[$i]->title,
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-dTH:i:sZ'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                    continue;
                }else{
                    array_push($combineAnnotations, [
                        "_id" => $annotations[$i]->id,
                        "category" => $annotations[$i]->category,
                        "eventSource" => [
                            "type" => $annotations[$i]->event_type,
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => $annotations[$i]->title,
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-dTH:i:sZ'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                }
            }else{
                array_push($combineAnnotations, [
                    "_id" => $annotations[$i]->id,
                    "category" => $annotations[$i]->category,
                    "eventSource" => [
                        "type" => $annotations[$i]->event_type,
                        "name" => $annotations[$i]->event_name,
                    ],
                    "url" => $annotations[$i]->url,
                    "description" => $annotations[$i]->description,
                    "title" => $annotations[$i]->title,
                    "highlighted" => false,
                    "publishDate" => $showDate->format('Y-m-dTH:i:sZ'), //"2020-08-30T00:00:00.000Z"
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
        $user_data = Auth::id();

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->user_id = $user_data;
        $annotation->save();

        return redirect()->back();
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
        $user_data = Auth::id();
        if($user_data !== $annotation->user_id) abort(404);

        $annotation->fill($request->validated());
        $annotation->save();

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annotation $annotation)
    {
        $user_data = Auth::id();
        if($user_data !== $annotation->user_id) abort(404);

        $annotation->delete();
        return redirect()->back();
    }

    public function upload(Request $request)
    {
        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);

        if (count($headers) !== 8) {
            return redirect()->back()->with('error', "Kindly use proper formatted CSV.");
        }
        foreach ($headers as $header) {
            if (!in_array($header, [
                'category', 'event_type', 'event_name',
                'url', 'description', 'title', 'show_at', 'type',
            ])) {
                return redirect()->back()->with('error', "Kindly use proper formatted CSV.");
            }
        }

        $user_data = Auth::id();

        $rows = array();
        foreach ($filecontent as $line) {
            $row = array();
            $values = str_getcsv($line);
            if ($headers !== $values && count($values) == count($headers)) {
                for ($i = 0; $i < count($headers); $i++) {
                    $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                }
                $row['user_id'] = $user_data;
                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                Annotation::insert($rows);
                $rows = array();
            }
        }

        if (count($rows)) {
            Annotation::insert($rows);
        }

        return redirect()->back()->with('success', "Annotations added.");
    }
}
