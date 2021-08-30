<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;

class PricePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::guard('admin')->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'short_description' => 'required|string',
            'annotations_count' => "required|numeric",
            'price' => "required|numeric",
            'has_manual_add' => "nullable",
            'has_csv_upload' => "nullable",
            'has_api' => "nullable",
            'has_notifications' => "nullable",
            'has_google_data_studio' => "nullable",
            'is_enabled' => "nullable",
            'is_available' => "nullable",
            'ga_account_count' => 'nullable|numeric',
            'user_per_ga_account_count' => 'nullable|numeric',
            'web_monitor_count' => 'nullable|numeric',
            'owm_city_count' => 'nullable|numeric',
            'google_alert_keyword_count' => 'nullable|numeric',
        ];
    }
}
