<?php

namespace App\Http\Requests;

use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                    'password' => ['required', 'string', 'min:8', 'confirmed', new HasSymbol, new HasLettersNumbers],
                    'user_level' => ['required', 'in:admin,team,viewer'],
                    'department' => 'nullable|string|max:100',
                    'google_analytics_account_id' => 'nullable|array',
                    'google_analytics_account_id.*' => 'nullable|exists:google_analytics_accounts,id',
                    'team_name' => 'nullable|string|max:100',
                ];
                break;

            case 'PUT':
                return [
                    'name' => ['nullable', 'string', 'max:255'],
                    'email' => ['nullable', 'string', 'email', 'max:255'],
                    'password' => ['nullable', 'string', 'min:8', 'confirmed', new HasSymbol, new HasLettersNumbers],
                    'user_level' => ['nullable', 'in:admin,team,viewer'],
                    'department' => 'nullable|string|max:100',
                    'google_analytics_account_id' => 'nullable|array',
                    'google_analytics_account_id.*' => 'nullable|exists:google_analytics_accounts,id',
                    'team_name' => 'nullable|string|max:100',
                ];
                break;
        }
    }
}
