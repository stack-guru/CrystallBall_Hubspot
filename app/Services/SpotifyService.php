<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;

use App\Models\SpotifyAnnotations;
use App\Models\GoogleAccount;

   
class SpotifyService {

    protected $client_id;
    protected $client_secret;

    protected $clientId;
    protected $clientSecret;

    public function __construct() {

        //Google Services SecretKeys
        $this->client_id = config('services.google.client_id');
        $this->client_secret = config('services.google.client_secret');
 
        //Spotify Services SecretKeys
        $this->clientId = config('servies.spotify_annotation.clientId');
        $this->clientSecret = config('services.spotify_annotation.clientSecret');
        
    }
    
    //Spotify Searching API

    public function loginUser(SpotifyAnnotations $spotifyAnnotations){

        // if(!$spotifyAnnotations -> refresh_token){
        //     Log::channel("spotify_annotation")->error("User is not login", ["Spotify_Annotations =>$spotifyAnnotation->email"]);
        //     return false;
        // };
        // 


        $url = "https://api.spotify.com/v1/search";
        
        $response = Http::get($url, [
            'clientId' => $this->clientId,
            'clientSecret' => $this->clientSecret,
            'header' => 'Content-Type: application/ x-www-form-urlencoded',
        ]);
        

        Log::debug("Data fri=om Spotify", [$response]);
       

        if($response==false){
            return false;
        }

        $data=  $response->json();
        return['success' => true, 'data' => $data];
    }

    public function timestampToken($spotifyAnnotations, $didErrorOccur = false, $response = ''): bool
    {
        if ($didErrorOccur) {
            $spotifyAnnotations->last_unsuccessful_use_at = Carbon::now();
            return $spotifyAnnotations->save();
        } else {
            $spotifyAnnotations->last_successful_use_at = Carbon::now();
            return $spotifyAnnotations->save();
        }
    }

}



        // if($response->status() == 401){
        //     Log::channel("spotify_annotation")->error("Unable to access the data", ["Spotify_Annotations" => $spotifyAnnotation->email, "response" => $response->json()]);
        //     return false;
        // }


//     //User Google Authorization
//     public function refreshToken(GoogleAccount $googleAccount)
//     {
//         if (!$googleAccount->refresh_token) {
//             Log::debug("message", [$googleAccount]);
// 
//             Log::channel('google')->error("Refresh token does not exist for this Google Account.",  ['GoogleAccount' => $googleAccount->email]);
//             return false;
//         }
// 
//         $url = "https://www.googleapis.com/oauth2/v4/token";
// 
//         $response = Http::post($url, [
//             'client_id' => $this->client_id,
//             'client_secret' => $this->client_secret,
//             'refresh_token' => $googleAccount->refresh_token,
//             'grant_type' => 'refresh_token',
//         ]);
// 
//         if ($response->status() == 401) {
//             Log::channel('google')->error("Unable to refresh access token for google account.",  ['GoogleAccount' => $googleAccount->email, 'response' => $response->json()]);
//             return false;
//         }
// 
//         $respJson = $response->json();
//         if (!array_key_exists('access_token', $respJson)) {
//             Log::channel('google')->error("Unable to refresh access token for google account.",  ['GoogleAccount' => $googleAccount->email, 'response' => $response->json()]);
//             return false;
//         }
// 
//         $googleAccount->token = $respJson['access_token'];
//         $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($respJson['expires_in']);
//         $googleAccount->save();
// 
//         return $googleAccount;
//     }


//     public function getAllFeeds($keyword){
//         {
//             $curl = curl_init();
// 
//             $url = "https://api.spotify.com/v1/search";
//             $client_id = "c0e663d8703e414d8524f57000ef8566";
//             $client_secret = "7dcdd9f9326c4cf18af6f997526de125";
//     
//             $data = array(
//                 'grant_type' => 'authorization_code',
//                 'code'=>$_REQUEST['code'],
//                 'redirect_uri'=>$redirect_uri,
//                 'client_id'=>$client_id,
//                 'client_secret'=>$client_secret
//             );
//     
//             $header = array('Content-Type: application/ x-www-form-urlencoded');
//                 
//             curl_setopt_array($curl, [
//                 CURLOPT_HTTPHEADER => $header,
//                 CURLOPT_URL => $url,
//                 CURLOPT_RETURNTRANSFER => true,
//                 CURLOPT_ENCODING => "",
//                 CURLOPT_MAXREDIRS => 10,
//                 CURLOPT_TIMEOUT => 30,
//                 CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//                 CURLOPT_CUSTOMREQUEST => "GET",
//                 CURLOPT_POSTFIELDS => json_encode($data),
// 
//             ]);
//     
//             $response = curl_exec($curl);
//             $err = curl_error($curl);
//             curl_close($curl);
//     
//             if ($err) {
//                 return false;
//             }
//     
//             try {
//                 $doc = new DOMDocument;
//                 $doc->loadHTML($response);
//                 $doc->normalize();
//                 $lis = $doc->getElementsByTagName('li');
//             } catch (Exception $exception) {
//                 log(print_r($exception->getMessage(), 1));
//                 return false;
//             }
//     
//             $parsedAlerts = [];
//             foreach ($lis as $li) {
//                 if ($li->getAttribute('class') == 'result') {
//                     $alert = [];
//                     foreach ($li->childNodes as $cN) {
//                         if ($cN->nodeType != 3) {
//                             switch ($cN->getAttribute('class')) {
//                                 case 'result_category_container':
//                                     $alert['category'] = $cN->childNodes->item(1)->childNodes->item(1)->childNodes->item(1)->getAttribute('src');
//                                     break;
//                                 case 'result_event':
//                                     $alert['event'] = $cN->nodeValue;
//                                     if ($cN->childNodes->item(1)->nodeName == 'a') {
//                                         $url = $cN->childNodes->item(1)->getAttribute('href');
//                                         $alert['url'] = urldecode(substr($url, 42, strpos($url, '&ct=ga') - 42));
//                                     }
//                                     break;
//                                 default:
//                                     if ($cN->nodeName == 'div') {
//                                         $alert['description'] = $cN->nodeValue;
//                                     }
//                                     break;
//                             }
//                         }
//                     }
//     
//                     $parsedAlerts[$li->parentNode->parentNode->childNodes->item(1)->nodeValue][] = $alert;
//                 }
//             }
//     
//             return $parsedAlerts;
//         }
//     }   