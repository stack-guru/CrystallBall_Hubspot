<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\ShopifyAnnotation;

class ShopifyService {
    //Shopify API
    public function saveShopifyProducts($url, $userID){
        try {

            $response = Http::get($url . '/products.json');
            $products = $response['products'];

            $productIDs = [];
            foreach($products as $product) {
                $productId = $product['id'];
                $productIDs[] = $productId;
                $annotation = ShopifyAnnotation::where('product_id', $productId)->first();
                if (!$annotation) {
                    $annotation = new ShopifyAnnotation();
                    $annotation->category = "New Product";
                    $annotation->product_id = $productId;
                    $annotation->user_id = $userID;
                    $annotation->published_at = $product['published_at'];
                    $annotation->product_type = $product['product_type'];
                } else {
                    $annotation->category = "Updated Product";
                }
                $saveRecord = !$annotation || ($annotation && $annotation->shopify_updated_at !== $product['updated_at']);
                if ($saveRecord) {
                    $annotation->title = $product['title'];
                    $annotation->handle = $product['handle'];
                    $annotation->body_html = $product['body_html'];
                    $annotation->vendor = $product['vendor'];
                    $annotation->shopify_updated_at = $product['updated_at'];
                    $annotation->save();
                }
            }

            $allExistingAnnotations = ShopifyAnnotation::whereNotIn('product_id', $productIDs)->get();
            foreach($allExistingAnnotations as $product) {
                $product->category = "Removed Product";
                $product->save();
            }
            return true;
        } catch (\Exception $e) {
            Log::channel('shopify')->debug($e);
            return false;
        }
    }

}
