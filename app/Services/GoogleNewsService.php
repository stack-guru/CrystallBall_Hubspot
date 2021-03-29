<?php

namespace App\Services;

use SimpleXMLElement;

class GoogleNewsService
{
    public function getAllFeeds($keyword)
    {
        $curl = curl_init();

        $params = urlencode($keyword);

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=" . $params,
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

        $xml = new SimpleXMLElement($response);
        
        $parsedNews = [];
        foreach($xml->channel->item as $item){
            $arr = [];

            $arr['title'] = (string) $item->title;
            $arr['link'] = (string) $item->link;
            $arr['guid'] = (string) $item->guid;
            $arr['pubDate'] = (string) $item->pubDate;
            $arr['description'] = (string) $item->description;
            $arr['source'] = (string) $item->source;

            array_push($parsedNews, $arr);
        }
        
        return $parsedNews;
    }

}
