<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFacebookAccount extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function pages()
    {
        return $this->hasMany(\App\Models\UserFacebookPage::class, 'user_facebook_account_id', 'facebook_account_id');
    }
}
