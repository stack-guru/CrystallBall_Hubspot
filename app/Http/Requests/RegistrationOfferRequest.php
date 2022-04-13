<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class RegistrationOfferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::guard('admin')->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'code' => 'required|string',
            'heading' => 'required|string',
            'description' => 'nullable|string',

            'on_click_url' => 'nullable|string',
            'discount_percent' => 'required|string',

            'monthly_recurring_discount_count' => 'required|numeric',
            'yearly_recurring_discount_count' => 'required|numeric',

            'expires_in_period' => 'required|string',
            'expires_in_value' => 'required|numeric',

            'is_enabled' => "nullable",
        ];
    }
}
