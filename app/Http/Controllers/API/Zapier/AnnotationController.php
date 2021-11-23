<?php

namespace App\Http\Controllers\API\Zapier;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AnnotationController extends Controller
{

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        $userId = $user->id;

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = $userId;
        $annotation->is_enabled = true;
        $annotation->added_by = 'manual';
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

        return ['annotation' => $annotation];
    }
}
