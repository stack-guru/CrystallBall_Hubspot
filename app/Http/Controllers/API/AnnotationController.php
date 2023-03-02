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
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Support\Facades\DB;

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
            abort(402, "Please upgrade your plan to use API feature.");
        }

        $annotations = Annotation::ofCurrentUser()->get();
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
            abort(402, "Please upgrade your plan to use API feature.");
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404, "Unable to find annotations with the given id.");
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
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "Please upgrade your plan to add more annotations");
        }

        $userId = $user->id;
        $pricePlan = $user->pricePlan;
        if (!$pricePlan->has_api) {
            Mail::to($user)->send(new FreeUserCalledAPIMail);
            return response()->json(['message' => "API Access is not allowed in your price plan."], 402);
        }

        if ($request->has('google_analytics_property_id')) {
            if ($pricePlan->ga_account_count == 1) {
                Mail::to($user)->send(new BasicUserUsedGAPropertyMail);
                return response()->json(['message' => "Apologies! Your current plan doesn't support properties on API.\nAsk the admin of this account to upgrade and continue enjoying the " . config('app.name') . " properties feature."], 402);
            }
        }

        DB::beginTransaction();
        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = Auth::id();
        $annotation->added_by = 'api';
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
            }
        } else {
            $aGAP = new AnnotationGaProperty;
            $aGAP->annotation_id = $annotation->id;
            $aGAP->google_analytics_property_id = null;
            $aGAP->user_id = $userId;
            $aGAP->save();
        }
        DB::commit();

        if ($user->last_api_called_at == null) {
            event(new UserUsedApiForFirstTime($user));
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        $currentUser = Auth::user();

        \App\Events\UserAddedAnAnnotationViaAPI::dispatch($currentUser);
        $currentUser->notify(new AnnotationCreatedThroughAPI);
        event(new \App\Events\AnnotationCreated($annotation));
        event(new UserUsedAPI);

        $annotation->unsetRelation('user');
        return response()->json([
            'annotation' => $annotation,
            // 'validated_request' => $request->validated(),
            // 'raw_request' => $request->getContent()
        ], 201);
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
            abort(404, "Unable to find annotation with the given id.");
        }

        $pricePlan = $user->pricePlan;
        if (!$pricePlan->has_api) {
            Mail::to($user)->send(new FreeUserCalledAPIMail);
            return response()->json(['message' => "API Access is not allowed in your price plan."], 402);
        }

        if ($request->has('google_analytics_property_id')) {
            if ($pricePlan->ga_account_count == 1) {
                Mail::to($user)->send(new BasicUserUsedGAPropertyMail);
                return response()->json(['message' => "Apologies! Your current plan doesn't support properties on API.\nAsk the admin of this account to upgrade and continue enjoying the " . config('app.name') . " properties feature."], 402);
            }
        }

        DB::beginTransaction();
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
                }
            } else {
                $aGAP = new AnnotationGaProperty;
                $aGAP->annotation_id = $annotation->id;
                $aGAP->google_analytics_property_id = null;
                $aGAP->user_id = $user->id;
                $aGAP->save();
            }
        }
        DB::commit();

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
            abort(402, "Please upgrade your plan to use API feature.");
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404, "Unable to find annotation with the given id.");
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

    public function bulk_delete(Request $request)
    {
        dd($request->all());
        # code...
    }
    public function delete_annotations(Request $request)
    {
        dd($request->all());
        # code...
    }
}
