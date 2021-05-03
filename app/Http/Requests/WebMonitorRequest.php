<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WebMonitorRequest extends FormRequest
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
            'name' => 'required|string',
            'url' => 'required|string|active_url',
            'email_address' => 'nullable|email',
            'sms_phone_number' => 'nullable|string',
            'google_analytics_property_id' => 'nullable|array',
            'google_analytics_property_id.*' => 'nullable|exists:google_analytics_properties,id',
        ];
    }
}
