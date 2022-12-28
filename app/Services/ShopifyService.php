<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\ShopifyAnnotation;
use Illuminate\Support\Facades\Auth;
use App\Mail\AdminFailedShopifyScriptMail;
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
            $productIDs = [];
            foreach($products as $product) {
                $productId = $product->id;
                $productIDs[] = $productId;
                $annotation = ShopifyAnnotation::where('product_id', $productId)->first();
                if (!$annotation) {
                    $annotation = new ShopifyAnnotation();
                    $annotation->category = "New Product";
                    $annotation->product_id = $productId;
                    $annotation->user_id = $userID;
                    $annotation->published_at = $product->published_at;
                    $annotation->product_type = $product->product_type;
                } else {
                    $annotation->category = "Updated Product";
                }
                $saveRecord = !$annotation || ($annotation && $annotation->shopify_updated_at !== $product->updated_at);
                if ($saveRecord) {
                    $annotation->title = $product->title;
                    $annotation->handle = $product->handle;
                    $annotation->body_html = $product->body_html;
                    $annotation->vendor = $product->vendor;
                    $annotation->shopify_updated_at = $product->updated_at;
                    $annotation->save();
                }
            }

            $allExistingAnnotations = ShopifyAnnotation::whereNotIn('product_id', $productIDs)->get();
            foreach($allExistingAnnotations as $product) {
                $product->category = "Removed Product";
                $product->save();
            }

            // close curl resource to free up system resources
            curl_close($ch);
            return true;
        } catch (\Exception $e) {
            Log::channel('shopify')->debug($e);
            $admin = Admin::first();
            $message = "Shopify script is crashed. Please have a look into the code to fix!";
            Log::error($e);
            return $e;
        }
    }

}
