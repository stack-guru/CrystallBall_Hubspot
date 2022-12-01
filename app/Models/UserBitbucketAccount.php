<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBitbucketAccount extends Model
{
    use HasFactory;

    protected $table = "user_bitbucket_accounts";

    protected $fillable = [
        "user_id",
        "name",
        "token",
        "token_expires_at",
        "bitbucket_account_id",
        "bitbucket_user_email",
        "bitbucket_avatar_url",
        "refresh_token"
    ];
}
