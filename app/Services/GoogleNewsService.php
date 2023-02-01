<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use SimpleXMLElement;
use Symfony\Component\HttpFoundation\Response;

class GoogleNewsService
{
    public function getAllFeeds($keyword)
    {
        $params = urlencode($keyword);
        $baseUrl    = "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=" . $params;
        $response = Http::get($baseUrl);
        if ($response->status() != Response::HTTP_OK) {
            return false;
        }

        $xml = new SimpleXMLElement($response->body());
        
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
