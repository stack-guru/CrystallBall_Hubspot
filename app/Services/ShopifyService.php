<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\ShopifyAnnotation;
use Illuminate\Support\Facades\Auth;
use Goutte\Client;
use App\Models\Admin;

class ShopifyService {

    //Shopify API
    public function saveShopifyProducts($url, $userID){
        try {

            $ch = curl_init();

            // set url
            curl_setopt($ch, CURLOPT_URL, $url . '/products.json');

            //return the transfer as a string
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

            // $output contains the output string
            $output = json_decode(curl_exec($ch));

            $products = $output->products;
            foreach($products as $product) {
                $annotation = new ShopifyAnnotation();
                $annotation->user_id = $userID;
                $annotation->category = "Shopify Product";
                $annotation->product_id = $product->id;
                $annotation->title = $product->title;
                $annotation->handle = $product->handle;
                $annotation->body_html = $product->body_html;
                $annotation->published_at = $product->published_at;
                $annotation->vendor = $product->vendor;
                $annotation->product_type = $product->product_type;
                $annotation->save();
            }

            // close curl resource to free up system resources
            curl_close($ch);
            return true;
        } catch (\Exception $e) {
            Log::channel('Shopify Error')->debug($e);
            Log::error($e);
            return false;
        }
    }

}
