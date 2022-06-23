<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\UserDataSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DataForSeoController extends Controller
{

    /**
     * @return JsonResponse
     */
    public function getSearchEngineList()
    {
        $selected_search_engine = UserDataSource::where('user_id', auth()->user()->id)->where('ds_code', 'keyword_tracking')->first();
        $all_search_engines = config('data_for_seo.search_engines');
        $selected = [
            'label' => '',
            'value' => ''
        ];
        if($selected_search_engine){
            foreach ($all_search_engines as $s) {
                if ($s['value'] == $selected_search_engine->search_engine) {
                    $selected = $s;
                }
            }
        }
        return response()->json([
            'search_engines' => config('data_for_seo.search_engines'),
            'selected_search_engine' => $selected,
        ]);
    }

    public function getLocationList()
    {
        $data_source = UserDataSource::where('user_id', auth()->user()->id)->where('ds_code', 'keyword_tracking')->first();
        $locations = Location::limit(100)->get([
            'location_name as label',
            'location_code as value'
        ])->toArray();
        $selected = [
            'label' => '',
            'value' => ''
        ];
        if ($data_source){
            $selected_location = Location::where('location_code', $data_source->location)->first();
            $selected = [
                'label' => $selected_location->location_name,
                'value' => $selected_location->location_code
            ];
            $locations[] = $selected;
        }
        return response()->json([
            'locations' => $locations,
            'selected_location' => $selected,
        ]);
    }

    public function searchLocationList(Request $request)
    {
        $locations = Location::where('location_name', 'LIKE', '%' . $request->search_str . '%')->get([
            'location_name as label',
            'location_code as value'
        ])->toArray();
        return response()->json([
            'locations' => $locations,
        ]);
    }
}
