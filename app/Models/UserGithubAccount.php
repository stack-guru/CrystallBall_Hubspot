<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGithubAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "name",
        "token",
        "token_expires_at",
        "github_account_id",
        "github_user_email",
        "github_avatar_url",
        "refresh_token"
    ];
}
