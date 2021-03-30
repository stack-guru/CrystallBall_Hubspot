<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserDataSourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * 
     * @return array
     */
    public function rules()
    {
        return [
            'ds_code' => 'required|string',
            'ds_name' => 'required|string',
            'country_name' => 'nullable|string',
            'retail_marketing_id' => 'nullable|numeric|exists:retail_marketings,id',
            'open_weather_map_city_id' => 'nullable|numeric|exists:open_weather_map_cities,id',
            'open_weather_map_event' => 'nullable|string',
            'status' => 'nullable|string',
            'value' => 'nullable|string',
            'is_enabled' => 'nullable',
        ];
    }
}
