<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppSumoLicenseRequest extends FormRequest
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
            'action' => 'required|string|in:activate,enhance_tier,reduce_tier,refund',
            'plan_id' => 'required|string|exists:price_plans,id',
            'uuid' => 'required|string',
            'activation_email' => 'required|email',
            'invoice_item_uuid' => 'required_if:action,activate|string'
        ];
    }
}
