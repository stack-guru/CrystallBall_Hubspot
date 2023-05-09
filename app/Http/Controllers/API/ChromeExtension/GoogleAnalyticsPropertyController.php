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
//        if ($request->has('keyword')) {
//            $keyword = $request->query('keyword');
//            return [
//                'google_analytics_properties' => GoogleAnalyticsProperty::ofCurrentUser()
//                    ->where(function ($query) use ($keyword) {
//                        $query->where('property_id', 'LIKE', "%$keyword%")
//                            ->orWhere('internal_property_id', 'LIKE', "%$keyword%")
//                            ->orWhere('default_profile_id', 'LIKE', "%$keyword%");
//                    })
//                    ->get(['id'])
//            ];
//        }

        $user = Auth::user();
//        $userIdsArray = $user->getAllGroupUserIdsArray();
//        $googleAnalyticsAccountIds = GoogleAnalyticsAccount::whereIn('user_id', $userIdsArray)->get(['id'])->pluck('id')->toArray();
        $keword = $request->keyword;
        $uniqueGoogleAnalyticsProperties = $this->getUniqueGoogleAnalyticsPropertiesByUser($user, $keword);
        return ['google_analytics_properties' => array_merge(
            [
                ['id' => '*', 'name' => 'Property: Auto detect',  "google_account" => [
                    "id" => null,
                    "name" => null
                ]],
            ],
            $uniqueGoogleAnalyticsProperties
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

    public function getUniqueGoogleAnalyticsPropertiesByUser($user, $keword)
    {
        $userIdsArray = $user->getAllGroupUserIdsArray();
        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount']);
        $googleAnalyticsPropertiesQuery->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful', 'is_in_use')
            ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
            ->where('name', 'LIKE', '%' . $keword . '%')
            ->whereIn('user_id', $userIdsArray);

        $googleAnalyticsAccountIdsArray = $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
        // Check if the price plan has google analytics properties allowed
        if ($user->pricePlan->google_analytics_property_count == -1) {
            abort(402, "Please upgrade your plan to use Google Analytics Properties.");
        }

        if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
            $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
            $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
            if ($user->assigned_properties_id != null) {
                $assigned_properties_ids = explode(',', $user->assigned_properties_id);
                $uniqueGoogleAnalyticsProperties = collect($uniqueGoogleAnalyticsProperties)->whereIn('id', $assigned_properties_ids)->values()->all();
            }
            return $uniqueGoogleAnalyticsProperties;
        } else {
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
            $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
            return $uniqueGoogleAnalyticsProperties;
        }
    }
}
