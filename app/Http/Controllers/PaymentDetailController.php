<?php

namespace App\Http\Controllers;

use App\Models\PaymentDetail;
use Illuminate\Http\Request;
use App\Http\Requests\PaymentDetailRequest;
use App\Services\BlueSnapService;
use Illuminate\Support\Facades\Auth;

class PaymentDetailController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PaymentDetailRequest $request)
    {
        $blueSnapService = new BlueSnapService;
        $user = Auth::user();
        if ($user->user_id) {
            abort(403, "Only account owner is allowed to add card details.");
        }

        $lastPaymentDetail = $user->lastPaymentDetail;
        // Every user must have subscribed to a plan from "Create Payment" page
        // to create a record in payment details table.
        // it is necessary to get first & last name and address details from user
        // to complete payment data for future payments and recurring payments
        // Hence is the below condition
        if (!$lastPaymentDetail) {
            abort(400, 'Unable to find any previous payment details. Please subscribe for a price plan from "Settings -> Plans" page in the left navigation page.');
            // $response = $blueSnapService->createVaultedShopper($request->only(['first_name', 'last_name']));
            // if ($response['success']) {
            //     $vaultedShopperId = $response['vaultedShopperId'];
            // } else {
            //     return $response;
            // }
        } else {
            $vaultedShopperId = $lastPaymentDetail->bluesnap_vaulted_shopper_id;
        }

        $response = $blueSnapService->addCardToVaultedShopper($vaultedShopperId, $request->only(['first_name', 'last_name', 'card_number', 'expiry_month', 'expiry_year', 'security_code']));

        $paymentDetail = new PaymentDetail;
        $paymentDetail->fill($request->validated());
        $paymentDetail->card_number = substr($request->card_number, -4, 4);
        $paymentDetail->billing_address = $lastPaymentDetail->billing_address;
        $paymentDetail->city = $lastPaymentDetail->city;
        $paymentDetail->zip_code = $lastPaymentDetail->zip_code;
        $paymentDetail->country = $lastPaymentDetail->country;
        //$paymentDetail->bluesnap_card_id
        $paymentDetail->bluesnap_vaulted_shopper_id = $vaultedShopperId;
        $paymentDetail->user_id = $user->id;
        $paymentDetail->save();

        return ['success' => true];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PaymentDetail  $paymentDetail
     * @return \Illuminate\Http\Response
     */
    public function destroy(PaymentDetail $paymentDetail)
    {
        //
    }
}
