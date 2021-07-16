<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificationSettingRequest extends FormRequest
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
        'is_enabled' => 'nullable',

        'email_seven_days_before' => 'nullable',
        'email_one_days_before' => 'nullable',
        'email_on_event_day' => 'nullable',

        'browser_notification_on_event_day' => 'nullable',

        'sms_on_event_day' => 'nullable',
        ];
    }
}
