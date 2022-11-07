<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SpotifyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
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
            'description' => 'nullable|string',
            'url' => 'required|string',
            'podcast_date' => 'nullable|string'


        ];
    }
}
