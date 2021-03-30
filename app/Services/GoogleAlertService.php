<?php

namespace App\Services;

use DOMDocument;

class GoogleAlertService
{
    public function getAllFeeds($keyword)
    {
        $curl = curl_init();

        $params = urlencode('[null,[null,null,null,[null,"' . $keyword . '","com",[null,"en","US"],null,null,null,0,1],null,3,[[null,1,"user@example.com",[null,null,11],2,"en-US",null,null,null,null,null,"0",null,null,"AB2Xq4hcilCERh73EFWJVHXx-io2lhh1EhC8UD8"]]],0]');

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://www.google.com/alerts/preview?params=" . $params,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "",
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return false;
        }

        $doc = new DOMDocument;
        $doc->loadHTML($response);
        $doc->normalize();
        $lis = $doc->getElementsByTagName('li');

        $parsedAlerts = [];
        foreach ($lis as $li) {
            if ($li->getAttribute('class') == 'result') {
                $alert = [];
                foreach ($li->childNodes as $cN) {
                    if ($cN->nodeType != 3) {
                        switch ($cN->getAttribute('class')) {
                            case 'result_image_container':
                                $alert['image'] = $cN->childNodes->item(1)->childNodes->item(1)->childNodes->item(1)->getAttribute('src');
                                break;
                            case 'result_title':
                                $alert['title'] = $cN->nodeValue;
                                if ($cN->childNodes->item(1)->nodeName == 'a') {
                                    $url = $cN->childNodes->item(1)->getAttribute('href');
                                    // https://www.google.com/url?rct=j&sa=t&url=
                                    $alert['url'] = urldecode(substr($url, 42, strpos($url, '&ct=ga') - 42));
                                }
                                break;
                            default:
                                if ($cN->nodeName == 'div') {
                                    $alert['description'] = $cN->nodeValue;
                                }
                                break;
                        }
                    }
                }

                $parsedAlerts[$li->parentNode->parentNode->childNodes->item(1)->nodeValue][] = $alert;
            }
        }

        return $parsedAlerts;
    }

}
