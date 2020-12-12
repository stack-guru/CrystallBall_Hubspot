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
            'retail_marketing_id' => 'nullable|numeric',
            'is_enabled' => 'nullable',
        ];
    }
}
