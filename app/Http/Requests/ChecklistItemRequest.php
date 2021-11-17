<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemRequest extends FormRequest
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
                    'name' => 'required|string|unique:checklist_items,name',
                    'label' => 'required|string',
                    'description' => ' nullable|string',
                    'url' => 'required|string',

                    'sort_rank' => 'required|numeric',
                ];
                break;

            case 'PUT':
            case 'PATCH':
                return [
                    'name' => 'nullable|string',
                    'label' => 'nullable|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|string|url',

                    'sort_rank' => 'nullable|numeric',
                ];
                break;
        }
    }
}
