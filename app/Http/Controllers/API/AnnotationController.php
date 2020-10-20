<?php

namespace App\Http\Controllers\API;

use App\Annotation;
use App\Http\Resources\annotation as annotationResource;
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
        $annotations = Annotation::where('user_id', Auth::id())->get();
            $resource= new annotationResource($annotations);
        return ['annotations' =>   $resource];
    }

    public function show(Annotation $annotation)
    {
        if($annotation->user_id != Auth::id()) abort(404);

        return ['annotation' => $annotation];
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
        if($annotation->user_id != Auth::id()) abort(404);
        $annotation->fill($request->validated());
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
        if($annotation->user_id != Auth::id()) abort(404);
        $annotation->delete();
        return ['success' => true];
    }

    
}
