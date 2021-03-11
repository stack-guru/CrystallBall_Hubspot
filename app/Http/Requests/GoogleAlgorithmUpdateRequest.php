<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GoogleAlgorithmUpdateRequest extends FormRequest
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
            'category' => 'required|string',
            'event_name' => 'required|string',
            'description' => 'required|string',
            'update_date' => 'required|date',
            'url' => 'nullable|string',
            'status' => 'nullable'
        ];
    }
}
