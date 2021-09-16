<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStartupConfigurationRequest extends FormRequest
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
            'step_number.*' => 'required|numeric|max:50',
            'data_label.*' => 'required|string|max:500',
            'data_value.*' => 'nullable|string|max:500',
        ];
    }
}
