<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'price_plan_id',
        'price_plan_expiry_date',

        'is_ds_holidays_enabled',
        'is_ds_google_algorithm_updates_enabled',
        'is_ds_weather_alerts_enabled',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',

        "last_logged_into_extension_at",
        "last_activated_any_data_source_at",
        "last_generated_api_token_at",
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',

        'is_ds_holidays_enabled' => 'boolean',
        'is_ds_google_algorithm_updates_enabled' => 'boolean',
        'is_ds_retail_marketing_enabled' => 'boolean',
        'is_ds_weather_alerts_enabled' => 'boolean',

        "last_logged_into_extension_at" => 'datetime',
        "last_activated_any_data_source_at" => 'datetime',
        "last_generated_api_token_at" => 'datetime',
    ];

    public function pricePlan()
    {
        return $this->belongsTo('App\Models\PricePlan');
    }

    public function paymentDetails()
    {
        return $this->hasMany('App\Models\PaymentDetail');
    }

    public function lastPaymentDetail(){
        return $this->hasOne('App\Models\PaymentDetail')->orderBy('created_at', 'DESC');
    }

    public function lastAnnotation(){
        return $this->hasOne('App\Models\Annotation')->orderBy('created_at', 'DESC');
    }
    public function annotations()
    {
        return $this->hasMany('App\Models\Annotation');
    }

    public function googleAccounts()
    {
        return $this->hasMany('App\Models\GoogleAccount');
    }
}
