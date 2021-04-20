<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Http\Resources\annotation as annotationResource;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Services\SendGridService;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        $annotations = Annotation::where('user_id', Auth::id())->get();
        $resource = new annotationResource($annotations);

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['annotations' => $resource];
    }

    public function show(Annotation $annotation)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

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
        $user = Auth::user();
        $userId = $user->id;
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->user_id = Auth::id();
        $annotation->added_by = 'api';
        $annotation->save();

        if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
            foreach ($request->google_analytics_property_id as $gAPId) {
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

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

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
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->save();

        $aGAPs = $annotation->annotationGaProperties;
        $oldGAPIds = $aGAPs->pluck('google_analytics_property_id')->toArray();
        $newGAPIds = $request->google_analytics_property_id;

        foreach ($aGAPs as $aGAP) {
            if (!in_array($aGAP->google_analytics_property_id, $newGAPIds)) {
                $aGAP->delete();
            }
        }

        if ($request->has('google_analytics_property_id')) {
            if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
                foreach ($newGAPIds as $gAPId) {
                    if (!in_array($gAPId, $oldGAPIds)) {
                        $aGAP = new AnnotationGaProperty;
                        $aGAP->annotation_id = $annotation->id;
                        $aGAP->google_analytics_property_id = $gAPId;
                        $aGAP->user_id = $user->id;
                        $aGAP->save();
                    }
                }
            } else {
                $aGAP = new AnnotationGaProperty;
                $aGAP->annotation_id = $annotation->id;
                $aGAP->google_analytics_property_id = null;
                $aGAP->user_id = $user->id;
                $aGAP->save();
            }
        }

        $annotation->load('annotationGaProperties');

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

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
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        // onDelete cascade was added during migration but still we have to do this
        // because of laravel migrations mistake
        foreach($annotation->annotationGaProperties as $aGAP){
            $aGAP->delete();
        }
        $annotation->delete();

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['success' => true];
    }

}
