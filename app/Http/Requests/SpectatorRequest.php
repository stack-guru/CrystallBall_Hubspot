<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SpectatorRequest extends FormRequest
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
            case 'PUT':
            case 'PATCH':
                return [
                    'name' => ['required', 'string', 'max:255'],
                    // password will be validated in some conditions in controller
                ];
                break;

            default:
                return [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:spectators'],
                    'password' => ['confirmed', 'required', 'string', 'min:8'],
                ];
        }
    }
}
