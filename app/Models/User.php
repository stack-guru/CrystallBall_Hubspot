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
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
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
}
