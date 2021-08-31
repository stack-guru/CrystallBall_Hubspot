<?php

namespace App\Http\Controllers;

use App\Models\PaymentDetail;
use Illuminate\Http\Request;
use App\Http\Requests\PaymentDetailRequest;
use App\Services\BlueSnapService;
use Auth;

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
        $lastPaymentDetail = $user->lastPaymentDetail;
        if (!$lastPaymentDetail) {
            abort(400);
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
