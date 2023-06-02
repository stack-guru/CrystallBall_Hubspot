<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserAnnotationColorRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'manual'                   => 'nullable|string|max:10',
            'csv'                      => 'nullable|string|max:10',
            'api'                      => 'nullable|string|max:10',
            'holidays'                 => 'nullable|string|max:10',
            'google_algorithm_updates' => 'nullable|string|max:10',
            'retail_marketings'        => 'nullable|string|max:10',
            'weather_alerts'           => 'nullable|string|max:10',
            'web_monitors'             => 'nullable|string|max:10',
            'wordpress_updates'        => 'nullable|string|max:10',
            'google_alerts'            => 'nullable|string|max:10',
            'g_ads_history_change'     => 'nullable|string|max:10',
            'anomolies_detection'      => 'nullable|string|max:10',
            'budget_tracking'          => 'nullable|string|max:10',
            'keyword_tracking'         => 'nullable|string|max:10',
            'facebook_tracking'        => 'nullable|string|max:10',
            'instagram_tracking'       => 'nullable|string|max:10',
            'twitter_tracking'         => 'nullable|string|max:10',
            'wordpress'                => 'nullable|string|max:10',
            'shopify'                  => 'nullable|string|max:10',
            'apple_podcast'            => 'nullable|string|max:10',
            'youtube_tracking'         => 'nullable|string|max:10',
        ];
    }
}
