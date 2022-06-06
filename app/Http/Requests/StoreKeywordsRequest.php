<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKeywordsRequest extends FormRequest
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
            'url' => 'required',
            'search_engine' => 'required',
            'keywords' => 'required',
            'location' => 'required',
            'lang' => 'required',
            'ranking_direction' => 'required',
            'ranking_places' => 'required'
        ];
    }
}
