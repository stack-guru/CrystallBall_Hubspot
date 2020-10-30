<?php

namespace App\Http\Controllers;

use App\Models\User;
use Bluesnap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    public function __contruct()
    {
        Bluesnap::init(config('services.bluesnap.environment'), config('services.bluesnap.api.key'), config('services.bluesnap.api.password'));
    }

    public function checkPayment(Request $request)
    {

        return Redirect::route('payment.subscribe', ['price_plan_id' => $request->price_plan_id]);

    }

    public function subscribePlan(Request $request)
    {

        $user = Auth::user();
        $user->price_plan_id = $request->query('price_plan_id');
        $user->price_plan_expiry_date = new \DateTime("+1 month");
        $user->update();

        return Redirect::route('annotation.index', ['payment_successfull' => true]);

    }

    /**
     * Get a Transaction
     *
     * @param int $transaction_id
     * @return \tdanielcox\Bluesnap\Models\CardTransaction
     */
    public function getTransaction($transaction_id)
    {
        $response = \tdanielcox\Bluesnap\CardTransaction::get($transaction_id);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $transaction = $response->data;

        return $transaction;
    }

    /**
     * Authorize a New Transaction (with vendor, vaultedShopper, saved card)
     *
     * @param int $vaulted_shopper_id
     * @param int $vendor_id
     * @return \tdanielcox\Bluesnap\Models\CardTransaction
     */
    public function authorizeTransaction($vaulted_shopper_id, $vendor_id)
    {
        $response = \tdanielcox\Bluesnap\CardTransaction::create([
            'vendorInfo' => [
                'vendorId' => $vendor_id,
                'commissionAmount' => 4.00,
            ],
            'vaultedShopperId' => $vaulted_shopper_id,
            'creditCard' => [
                'cardLastFourDigits' => '1111',
                'securityCode' => '111',
                'cardType' => 'VISA',
            ],
            'amount' => 10.00,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_ONLY',
            'softDescriptor' => 'Your description',
        ]);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $transaction = $response->data;

        return $transaction;
    }
/**
 * Create a New Transaction (simple)
 *
 * @return \tdanielcox\Bluesnap\Models\CardTransaction
 */
    public function createTransaction()
    {
        $response = \tdanielcox\Bluesnap\CardTransaction::create([
            'creditCard' => [
                'cardNumber' => '4263982640269299',
                'expirationMonth' => '02',
                'expirationYear' => '2018',
                'securityCode' => '837',
            ],
            'amount' => 10.00,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_CAPTURE',
        ]);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $transaction = $response->data;

        return $transaction;
    }

}
