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
        $selected = [
            'label' => '',
            'value' => ''
        ];
        return response()->json([
            'search_engines' => config('data_for_seo.search_engines'),
            'selected_search_engine' => $selected,
        ]);
    }

    public function getLocationList()
    {
        $locations = Location::where('location_type', 'Country')->get([
            'location_name as label',
            'location_code as value'
        ])->toArray();
        $selected = [
            'label' => '',
            'value' => ''
        ];
        return response()->json([
            'locations' => $locations,
            'selected_location' => $selected,
        ]);
    }

    public function searchLocationList(Request $request)
    {
        $locations = Location::where('location_name', 'LIKE', '%' . $request->search_str . '%')->where('location_type', 'Country')->get([
            'location_name as label',
            'location_code as value'
        ])->toArray();
        return response()->json([
            'locations' => $locations,
        ]);
    }
}
