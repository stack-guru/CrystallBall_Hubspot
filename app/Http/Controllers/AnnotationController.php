<?php

namespace App\Http\Controllers;

use App\Models\Annotation;
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
        return view('ui/app');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function uiIndex()
    {
        $annotations = Annotation::where('user_id', Auth::id())->get();
        return ['annotations' =>   $annotations];
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
