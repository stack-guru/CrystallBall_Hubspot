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
                    'event_name' => 'required|string|max:100',
                    'url' => 'nullable|string',
                    'description' => 'nullable|string',
                    'show_at' => 'required|date',
                    'google_account_id' => 'nullable|exists:google_accounts,id',
                ];
                break;

            case 'PUT':
                return [
                    'category' => 'nullable|string|max:100',
                    'event_name' => 'nullable|string|max:100',
                    'url' => 'nullable|string',
                    'description' => 'nullable|string',
                    'show_at' => 'nullable|date',
                    'is_enabled' => 'nullable',
                    'google_account_id' => 'nullable|exists:google_accounts,id',
                ];
                break;
        }
    }
}
