<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
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
            'code' => 'nullable|string',
            'short_description' => 'required|string',
            'badge_text' => 'nullable|string',
            'annotations_count' => "required|numeric",
            'price' => "required|numeric",
            'has_manual_add' => "nullable",
            'has_csv_upload' => "nullable",
            'has_api' => "nullable",
            'has_notifications' => "nullable",
            'has_chrome_extension' => "nullable",
            'has_google_data_studio' => "nullable",
            'has_microsoft_power_bi' => "nullable",
            'is_enabled' => "nullable",
            'is_available' => "nullable",
            'is_hidden' => "nullable",
            'ga_account_count' => 'nullable|numeric',
            'shopify_monitor_count' => 'nullable|numeric',
            'user_per_ga_account_count' => 'nullable|numeric',
            'web_monitor_count' => 'nullable|numeric',
            'keyword_tracking_count' => 'nullable|numeric',
            'owm_city_count' => 'nullable|numeric',
            'google_alert_keyword_count' => 'nullable|numeric',
            'google_analytics_property_count' => 'nullable|numeric',
            'yearly_discount_percent' => 'nullable|numeric|min:0|max:100',
            'sort_rank' => 'nullable|numeric',
            'custom_plan_code' => 'nullable',
            'reference_text' => 'nullable',
            'users_devices_count' => 'required',
            'bitbucket_credits_count' => 'required',
            'github_credits_count' => 'required',
            'apple_podcast_monitor_count' => 'required',
            'youtube_credits_count' => 'required',
            'aws_credits_count' => 'required',
            'linkedin_credits_count' => 'required',
            'twitter_credits_count' => 'required',
            'holiday_credits_count' => 'required',
            'facebook_credits_count' => 'required',
            'instagram_credits_count' => 'required',
            'external_email' => 'required',
        ];
    }
}
