<?php

namespace App\Services;

use Bluesnap;

class BlueSnapService
{
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
        Bluesnap\Bluesnap::init(config('services.bluesnap.environment'), config('services.bluesnap.api.key'), config('services.bluesnap.api.password'));
    }

    /**
     * Get a Transaction
     *
     * @param int $transaction_id
     * @return \Bluesnap\Models\CardTransaction
     */
    public function getTransaction($pricePlan, $transaction_id)
    {
        $response = Bluesnap\CardTransaction::get($transaction_id);

        if ($response->failed()) {
            $error = $response->data;

            return ['success' => false, 'message' => $error];
        }

        $transaction = $response->data;

        return ['success' => true];
    }

    /**
     * Create a New Transaction (simple)
     *
     * @return \Bluesnap\Models\CardTransaction
     */
    public function createTransaction($price, $card, $vaultedShopperId = null)
    {

        $response = Bluesnap\CardTransaction::create([
            'creditCard' => [
                'cardNumber' => $card['cardNumber'],
                'expirationMonth' => $card['expirationMonth'],
                'expirationYear' => $card['expirationYear'],
                'securityCode' => $card['securityCode'],
            ],
            'amount' => $price,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_CAPTURE',
            'vaultedShopperId' => $vaultedShopperId,
            'storeCard' => $vaultedShopperId == null,
        ]);

        // Bluesnap\Response {#1325 ▼
        //     -_status: "error"
        //     +data: "The stated credit card expiration date has already passed."
        // }

        if ($response->failed()) {
            $error = $response->data;
            return ['success' => false, 'message' => $error];
        }

        $transaction = $response->data;

        return [
            'success' => true,
            'transactionId' => $transaction->id,
            'vaultedShopperId' => property_exists($transaction, 'vaultedShopperId') ? $transaction->vaultedShopperId : null,
        ];
    }

    /**
     * Create a VaultedShopper
     *
     * @return \Bluesnap\Models\VaultedShopper
     */
    public function createVaultedShopper($data)
    {
        $response = \Bluesnap\VaultedShopper::create($data);

        if ($response->failed()) {
            $error = $response->data;

            return ['success' => false, 'message' => $error];
        }

        $vaulted_shopper = $response->data;

        return [
            'success' => true,
            'vaultedShopperId' => $vaulted_shopper->id,
            //'networkTransactionId' => $vaulted_shopper->paymentSources->creditCardInfo[0]->processingInfo->networkTransactionId,
        ];
    }

    /**
     * Get a VaultedShopper
     *
     * @param int $vaulted_shopper_id
     * @return \Bluesnap\Models\VaultedShopper
     */
    public function getVaultedShopper($vaulted_shopper_id)
    {
        $response = \Bluesnap\VaultedShopper::get($vaulted_shopper_id);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $vaulted_shopper = $response->data;

        return $vaulted_shopper;
    }

    /**
     * Add a New Card to a VaultedShopper
     *
     * @param int $vaulted_shopper_id
     * @return \Bluesnap\Models\VaultedShopper
     */
    public function addCardToVaultedShopper($vaulted_shopper_id)
    {
        $vaulted_shopper = $this->getVaultedShopper($vaulted_shopper_id);

        $vaulted_shopper->paymentSources = [
            'creditCardInfo' => [
                [
                    'billingContactInfo' => [
                        'firstName' => 'John',
                        'lastName' => 'Smith',
                    ],
                    'creditCard' => [
                        'cardNumber' => '4263982640269299',
                        'expirationMonth' => '02',
                        'expirationYear' => '2018',
                        'securityCode' => '837',
                    ],
                ],
            ],
        ];

        $response = \Bluesnap\VaultedShopper::update($vaulted_shopper_id, $vaulted_shopper);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $vaulted_shopper = $response->data;

        return $vaulted_shopper;
    }
    /**
     * Authorize a New Transaction (with vendor, vaultedShopper, saved card)
     *
     * @param int $vaulted_shopper_id
     * @param int $vendor_id
     * @return \Bluesnap\Models\CardTransaction
     */
    public function authorizeTransaction($vaulted_shopper_id, $vendor_id)
    {
        $response = \Bluesnap\CardTransaction::create([
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

}
