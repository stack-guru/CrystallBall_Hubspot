<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RetailMarketingRequest extends FormRequest
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
                    'url'=>'required|string|max:100',
                    'show_at' => 'required|date',

                ];
                break;

            case 'PUT':
                return [
                    'category' => 'required|string|max:100',
                    'event_name' => 'required|string|max:100',
                    'description' => 'nullable|string',
                    'url'=>'required|string|max:100',
                    'show_at' => 'required|date'
                ];
                break;
        }
    }
}
