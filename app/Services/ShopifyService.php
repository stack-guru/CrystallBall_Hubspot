<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\ShopifyAnnotation;

class ShopifyService
{
    //Shopify API
    public function saveShopifyProducts($events, $products, $userID, $monitorID)
    {
        $productIDs = [];
        foreach ($products as $product) {
            $productId = $product['id'];
            $productIDs[] = $productId;
            $annotation = ShopifyAnnotation::where('product_id', $productId)->first();
            $new = !$annotation && in_array('New Product', $events);
            $update = $annotation && in_array('Updated Product', $events);
            if ($new) {
                $annotation = new ShopifyAnnotation();
                $annotation->category = "New Product";
                $annotation->product_id = $productId;
                $annotation->user_id = $userID;
                $annotation->published_at = $product['published_at'];
                $annotation->product_type = $product['product_type'];
            }
            if ($update) {
                $annotation->category = "Updated Product";
            }
            $saveRecord = $new || ($update && $annotation->shopify_updated_at !== $product['updated_at']);
            if ($saveRecord) {
                $annotation->monitor_id = $monitorID;
                $annotation->title = $product['title'];
                $annotation->handle = $product['handle'];
                $annotation->body_html = $product['body_html'];
                $annotation->vendor = $product['vendor'];
                $annotation->shopify_updated_at = $product['updated_at'];
                $annotation->save();
            }
        }

        if (in_array('Removed Product', $events)) {
            $allExistingAnnotations = ShopifyAnnotation::whereNotIn('product_id', $productIDs)->get();
            foreach ($allExistingAnnotations as $pro) {
                $pro->category = "Removed Product";
                $pro->save();
            }
        }
    }

    public function getShopifyProducts($url)
    {
        try {
            $response = Http::get($url . '/products.json');
            return $response['products'];
        } catch (\Exception $e) {
            Log::channel('shopify')->debug($e);
            return false;
        }
    }

}
