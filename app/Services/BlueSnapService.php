<?php

namespace App\Services;

use Bluesnap;

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

        $headers = [];

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_POST, 1);
        // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        // curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        // curl_setopt($curl, CURLOPT_HEADER, 1);

        curl_setopt($curl, CURLOPT_HTTPHEADER,
            [
                'Content-Type:application/json',
                'Accept:application/json',
                'Authorization: Basic ' . base64_encode( $this->key . ":" . $this->password ),
            ]
        );

        curl_setopt($curl, CURLOPT_HEADERFUNCTION,
            function ($ch, $header) use (&$headers) {
                $len = strlen($header);
                $header = explode(':', $header, 2);
                // ignore invalid headers
                if (count($header) < 2) {
                    return $len;
                }
                $headers[strtolower(trim($header[0]))][] = trim($header[1]);
                return $len;
            });

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            info($err);
            return false;
        }

        $tokenURL = $headers['location'][0];

        return substr($tokenURL, strlen($url)+1);
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
