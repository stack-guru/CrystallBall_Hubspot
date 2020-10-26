<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnnotationRequest extends FormRequest
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
        switch ($this->method()) {
            case 'POST':
                return [
                    'category' => 'required|string|max:100',
                    'event_type' => 'required|string|max:100',
                    'event_name' => 'required|string|max:100',
                    'url' => 'nullable|string',
                    'description' => 'nullable|string',
                    'title' => 'required|string|max:100',
                    'show_at' => 'required|date',
                    'type' => 'required|string|max:100',
                ];
                break;

            case 'PUT':
                return [
                    'category' => 'nullable|string|max:100',
                    'event_type' => 'nullable|string|max:100',
                    'event_name' => 'nullable|string|max:100',
                    'url' => 'nullable|string',
                    'description' => 'nullable|string',
                    'title' => 'nullable|string|max:100',
                    'show_at' => 'nullable|date',
                    'type' => 'nullable|string|max:100',
                    'is_enabled' => 'nullable',
                ];
                break;
        }
    }
}
