<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopifyAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "category",
        "title",
        "handle",
        "body_html",
        "vendor",
        "product_type",
        "published_at",
        "shopify_updated_at",
    ];

    protected $casts =[
        "published_at" => "date",
    ];
}
