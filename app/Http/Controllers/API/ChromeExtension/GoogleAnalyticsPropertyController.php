<?php


namespace App\Http\Controllers\API\ChromeExtension;

use Illuminate\Http\Request;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAnalyticsAccount;
use App\Models\AnnotationGaAccount;
use App\Models\AnnotationGaProperty;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class GoogleAnalyticsPropertyController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('keyword')) {
            $keyword = $request->query('keyword');
            return [
                'google_analytics_properties' => GoogleAnalyticsProperty::ofCurrentUser()
                    ->where(function ($query) use ($keyword) {
                        $query->where('property_id', 'LIKE', "%$keyword%")
                            ->orWhere('internal_property_id', 'LIKE', "%$keyword%")
                            ->orWhere('default_profile_id', 'LIKE', "%$keyword%");
                    })
                    ->get(['id'])
            ];
        }

        return ['google_analytics_properties' => array_merge(
            [
                ['id' => '*', 'name' => 'No Filter',  "google_account" => [
                    "id" => null,
                    "name" => null
                ]],
            ],
            GoogleAnalyticsProperty::ofCurrentUser()->orderBy('name')->with('googleAccount:id,name')->get(['id', 'name', 'google_account_id'])->toArray()
        )];
    }

    public function getAnnotations($id)
    {
        $annotations = AnnotationGaProperty::where([['user_id', Auth::id()], ['google_analytics_property_id', $id]])->get();
        $allAnnotaions = [];
        foreach ($annotations as $annotation) {
            array_push($allAnnotaions, $annotation->annotation);
        }
        return $allAnnotaions;
    }
}
