<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentDetailRequest extends FormRequest
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
            'card_number' => 'required|numeric',
            'expiry_month' => 'required|numeric',
            'expiry_year' => 'required|numeric',
            'security_code' => 'required|numeric',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'billing_address' => 'required|string',
            'city' => 'required|string',
            'zip_code' => 'nullable|string',
            'country' => 'required|string',
        ];
    }
}
