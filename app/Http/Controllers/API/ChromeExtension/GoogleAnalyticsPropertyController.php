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
        $properties=GoogleAnalyticsProperty::where('user_id',Auth::id())->orderBy('name')->with('googleAccount:id,name')->get(['id','name','google_account_id']);
        return $properties;
        // return ['google_analytics_accounts' => array_merge(
        //     [
        //         ['id' => '*', 'name' => 'No Filter'],
        //     ],
        //     GoogleAnalyticsProperty::select('google_analytics_accounts.id', 'name')->ofCurrentUser()
        //         ->distinct()
        //         ->join('annotation_ga_accounts', 'google_analytics_accounts.id', 'annotation_ga_accounts.google_analytics_account_id')
        //         ->get()->toArray()
        // )];

    }
    
    public function getAnnotations($id)
    {
        // return 'hello';
        $annotations=AnnotationGaProperty::where([['user_id',Auth::id()],['google_analytics_property_id',$id]])->get();
        $allAnnotaions=[];
        foreach($annotations as $annotation)
        {
            array_push($allAnnotaions,$annotation->annotation);
        }
        return $allAnnotaions;
    }
    
}
