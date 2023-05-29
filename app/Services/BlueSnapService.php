<?php

namespace App\Services;

use Bluesnap;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BlueSnapService
{

    protected $environment, $key, $password;
    protected $blueSnapDomain;
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
        $this->environment = config('services.bluesnap.environment');
        $this->key = config('services.bluesnap.api.key');
        $this->password = config('services.bluesnap.api.password');

        $this->blueSnapDomain = $this->environment == 'sandbox' ? 'https://sandbox.bluesnap.com' : 'https://ws.bluesnap.com';
        Bluesnap\Bluesnap::init(config('services.bluesnap.environment'), config('services.bluesnap.api.key'), config('services.bluesnap.api.password'));
    }

    public function getToken()
    {

        $url = $this->blueSnapDomain . '/services/2/payment-fields-tokens';

        $response = Http::withBasicAuth($this->key, $this->password)
            ->post($url . '?challengerequested3ds=true');

        $tokenURL = $response->header('location');

        return substr($tokenURL, strlen($url) + 1);
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
    public function createTransaction($price, $card, $vaultedShopperId = null, $token = null)
    {
        $response = Bluesnap\CardTransaction::create([
            // 'creditCard' => [
            //     // 'cardNumber' => $card['cardNumber'],
            //     // 'securityCode' => $card['securityCode'],
            //     'encryptedCardNumber' => $card['encryptedCreditCard'],
            //     'encryptedSecurityCode' => $card['encryptedCvv'],
            //     'expirationMonth' => $card['expirationMonth'],
            //     'expirationYear' => $card['expirationYear'],
            // ],
            'pfToken' => $token,
            'amount' => $price,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_CAPTURE',
            'vaultedShopperId' => $vaultedShopperId,
            // 'storeCard' => $vaultedShopperId == null,
            'storeCard' => true,
        ]);
        Log::channel('bluesnap')->info("Transaction event: ", [
            'request' => [
                'pfToken' => $token,
                'amount' => $price,
                'currency' => 'USD',
                'recurringTransaction' => 'ECOMMERCE',
                'cardTransactionType' => 'AUTH_CAPTURE',
                'vaultedShopperId' => $vaultedShopperId,
                'storeCard' => true,
                'card' => $card
            ],
            'response' => (array) $response->data
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
        $response = \Bluesnap\VaultedShopper::create([
            'email' => $data['email'],
            'firstName' => $data['first_name'],
            'lastName' => $data['last_name'],
            'country' => strtolower($data['country']),
            'city' => $data['city'],
            'address' => $data['billing_address'],
            'zip' => $data['zip_code'],
        ]);
        Log::channel('bluesnap')->info("Create Shopper Event: ", [
            'request' => [
                'email' => $data['email'],
                'firstName' => $data['first_name'],
                'lastName' => $data['last_name'],
                'country' => strtolower($data['country']),
                'city' => $data['city'],
                'address' => $data['billing_address'],
                'zip' => $data['zip_code'],
            ],
            'response' => (array)$response->data
        ]);

        if ($response->failed()) {
            $error = $response->data;

            return [
                'success' => false,
                'message' => $error,
                'vaultedShopperId' => null,
            ];
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
        Log::channel('bluesnap')->info("Fetched Vaulted Shopper Event: ", [
            'request' => ['vaulted_shopper_id' => $vaulted_shopper_id],
            'response' => (array) $response->data
        ]);

        if ($response->failed()) {
            $error = $response->data;
            return ['success' => false, 'message' => $error];
        }
        $vaulted_shopper = $response->data;

        return ['success' => true, 'vaultedShopper' => $vaulted_shopper];
    }

    /**
     * Add a New Card to a VaultedShopper
     *
     * @param int $vaulted_shopper_id
     * @return \Bluesnap\Models\VaultedShopper
     */
    public function addCardToVaultedShopper($vaulted_shopper_id, $card)
    {
        $vaulted_shopper = $this->getVaultedShopper($vaulted_shopper_id)['vaultedShopper'];

        $vaulted_shopper->paymentSources = [
            'creditCardInfo' => [
                [
                    'billingContactInfo' => [
                        'firstName' => $card['first_name'],
                        'lastName' => $card['last_name'],
                    ],
                    'creditCard' => [
                        'cardNumber' => $card['card_number'],
                        'expirationMonth' => $card['expiry_month'],
                        'expirationYear' => $card['expiry_year'],
                        'securityCode' => $card['security_code'],
                    ],
                ],
            ],
        ];
        $response = \Bluesnap\VaultedShopper::update($vaulted_shopper_id, $vaulted_shopper);
        Log::channel('bluesnap')->info("Add Card to Shopper Event: ", [
            'request' => [
                'vaulted_shopper_id' => $vaulted_shopper_id,
                'vaulted_shopper' => $vaulted_shopper
            ],
            'response' => (array) $response->data
        ]);

        if ($response->failed()) {
            $error = $response->data;
            return ['success' => false, 'message' => $error];
        }

        $vaulted_shopper = $response->data;
        return ['success' => true, 'vaultedShopper' => $vaulted_shopper, 'card' => ''];
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
