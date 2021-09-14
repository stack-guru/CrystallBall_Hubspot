<?php

namespace App\Http\Controllers\API;

use App\Events\UserUsedAPI;
use App\Events\UserUsedApiForFirstTime;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Http\Resources\annotation as annotationResource;
use App\Mail\BasicUserUsedGAPropertyMail;
use App\Mail\FreeUserCalledAPIMail;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Notifications\AnnotationCreatedThroughAPI;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        event(new UserUsedAPI);
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
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        event(new UserUsedAPI);

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
        $pricePlan = $user->pricePlan;
        if (!$pricePlan->has_api) {
            Mail::to($user)->send(new FreeUserCalledAPIMail);
            return response()->json(['message' => "API Access is not allowed in your price plan."], 402);
        }

        if ($request->has('google_analytics_property_id')) {
            if ($pricePlan->ga_account_count == 1) {
                Mail::to($user)->send(new BasicUserUsedGAPropertyMail);
                return response()->json(['message' => "Apologies! Your current plan doesn't support properties on API.\nAsk the admin of this account to upgrade and continue enjoying the GAannotations properties feature."], 402);
            }
        }

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
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
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        $currentUser = Auth::user();
        \App\Events\UserAddedAnAnnotationViaAPI::dispatch($currentUser);
        $currentUser->notify(new AnnotationCreatedThroughAPI);

        event(new UserUsedAPI);

        return response()->json(['annotation' => $annotation], 201);

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
        if ($annotation->user_id != $user->id) {
            abort(404);
        }

        $pricePlan = $user->pricePlan;
        if (!$pricePlan->has_api) {
            Mail::to($user)->send(new FreeUserCalledAPIMail);
            return response()->json(['message' => "API Access is not allowed in your price plan."], 402);
        }

        if ($request->has('google_analytics_property_id')) {
            if ($pricePlan->ga_account_count == 1) {
                Mail::to($user)->send(new BasicUserUsedGAPropertyMail);
                return response()->json(['message' => "Apologies! Your current plan doesn't support properties on API.\nAsk the admin of this account to upgrade and continue enjoying the GAannotations properties feature."], 402);
            }
        }

        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->save();

        if ($request->has('google_analytics_property_id')) {
            $aGAPs = $annotation->annotationGaProperties;
            $oldGAPIds = $aGAPs->pluck('google_analytics_property_id')->toArray();
            $newGAPIds = $request->google_analytics_property_id;

            foreach ($aGAPs as $aGAP) {
                if (!in_array($aGAP->google_analytics_property_id, $newGAPIds)) {
                    $aGAP->delete();
                }
            }

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
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        event(new UserUsedAPI);

        return response()->json(['annotation' => $annotation], 200);

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
        foreach ($annotation->annotationGaProperties as $aGAP) {
            $aGAP->delete();
        }
        $annotation->delete();

        if ($user->last_api_called_at == null) {
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        event(new UserUsedAPI);

        return response()->json([], 204);
    }

}
