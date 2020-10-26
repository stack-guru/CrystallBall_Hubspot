<?php

namespace App\Http\Requests;

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
            'annotations_count' => "required|numeric",
            'price' => "required|numeric",
            'has_manual_add' => "required",
            'has_csv_upload' => "required",
            'has_api' => "required",
            'is_enabled' => "required"
        ];
    }
}
