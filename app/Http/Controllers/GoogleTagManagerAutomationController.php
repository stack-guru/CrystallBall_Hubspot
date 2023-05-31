<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_TagManager;

class GoogleTagManagerAutomationController extends Controller
{

    public function redirectGtm()
    {   
        $client = new Google_Client();
        $client->setClientId(config('services.gtm.client_id'));
        $client->setClientSecret(config('services.gtm.client_secret'));
        $client->setRedirectUri(config('services.gtm.redirect_url'));
        $client->addScope('https://www.googleapis.com/auth/tagmanager.readonly');

        $authUrl = $client->createAuthUrl();
        return redirect()->away($authUrl);
    }

    /**
     * @return RedirectResponse
     */
    public function callbackGtm()
    {
        try {
            $client = new Google_Client();
            $client->setClientId(config('services.gtm.client_id'));
            $client->setClientSecret(config('services.gtm.client_secret'));
            $client->setRedirectUri(config('services.gtm.redirect_url'));
            $client->addScope('https://www.googleapis.com/auth/tagmanager.readonly');
            dd(request());
            if (request()->has('code')) {
                $token = $client->fetchAccessTokenWithAuthCode(request()->get('code'));
                $client->setAccessToken($token);
    
                $service = new Google_Service_TagManager($client);
                $accounts = $service->accounts->listAccounts();
                // You can retrieve the account ID from $accounts object
    
                // Example code to display the account IDs
                foreach ($accounts as $account) {
                    echo "Account ID: " . $account->getAccountId() . "<br>";
                }
                return redirect()->to("/data-source?show_facebook_popup=1&alertMessage=Account connected. You can enable the automation now.");
            }else{
                return redirect()->to('data-source')->with('Account not connected.');
            }
        }catch (\Exception $exception){
            return redirect()->to('data-source')->with($exception->getMessage());
        }
    }

}
