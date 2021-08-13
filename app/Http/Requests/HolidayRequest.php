<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HolidayRequest extends FormRequest
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

        //
        switch ($this->method()) {
            case 'POST':
                return [
                    'category' => 'required|string|max:100',
                    'event_name' => 'required|string|max:100',
                    'description' => 'nullable|string',
                    'country_name' => 'required|string|max:100',
                    'holiday_date' => 'required|date',
                    'url' => 'nullable|string',
                    'event_type' => 'nullable|string',
                    'description2' => 'nullable|string',
                ];
                break;

            case 'PUT':
                return [
                    'category' => 'required|string|max:100',
                    'event_name' => 'required|string|max:100',
                    'description' => 'nullable|string',
                    'country_name' => 'required|string|max:100',
                    'holiday_date' => 'required|date',
                    'url' => 'nullable|string',
                    'event_type' => 'nullable|string',
                    'description2' => 'nullable|string',
                ];
                break;
        }

    }
}
