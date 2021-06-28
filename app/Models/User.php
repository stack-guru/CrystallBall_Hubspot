<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'is_ds_retail_marketing_enabled',
        'is_ds_google_alerts_enabled',
        'is_ds_wordpress_updates_enabled',
        'is_ds_web_monitors_enabled',

        'user_level',
        'department',

        'team_name',
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
        'trial_ended_at' => 'datetime',

        'is_ds_holidays_enabled' => 'boolean',
        'is_ds_google_algorithm_updates_enabled' => 'boolean',
        'is_ds_retail_marketing_enabled' => 'boolean',
        'is_ds_weather_alerts_enabled' => 'boolean',
        'is_ds_google_alerts_enabled' => 'boolean',
        'is_ds_wordpress_updates_enabled' => 'boolean',
        'is_ds_web_monitors_enabled' => 'boolean',

        "last_logged_into_extension_at" => 'datetime',
        "last_activated_any_data_source_at" => 'datetime',
        "last_generated_api_token_at" => 'datetime',
        "last_api_called_at" => "datetime",
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['user'];

    public function pricePlan()
    {
        return $this->belongsTo('App\Models\PricePlan');
    }

    public function paymentDetails()
    {
        return $this->hasMany('App\Models\PaymentDetail');
    }

    public function lastPaymentDetail()
    {
        return $this->hasOne('App\Models\PaymentDetail')->orderBy('created_at', 'DESC');
    }

    public function lastAnnotation()
    {
        // Have to exclude Sample Annotation from last added annotation SQL.
        // Better approach was to add any boolean value to check if the annotation is a sample annotation
        // But it's done this way
        return $this->hasOne('App\Models\Annotation')->where('event_name', '<>', 'Sample Annotation')->orderBy('created_at', 'DESC');
    }

    public function annotations()
    {
        return $this->hasMany('App\Models\Annotation');
    }

    public function googleAccounts()
    {
        return $this->hasMany('App\Models\GoogleAccount');
    }

    public function googleAnalyticsAccounts()
    {
        return $this->hasMany('App\Models\GoogleAnalyticsAccount');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }

    public function loginLogs()
    {
        return $this->hasMany('App\Models\LoginLog');
    }

    public function userGaAccounts()
    {
        return $this->hasMany('App\Models\UserGaAccount');
    }

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    /**
     * Get all of the webMonitors for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function webMonitors(): HasMany
    {
        return $this->hasMany(WebMonitor::class);
    }

    /**
     * Get the userAnnotationColor associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function userAnnotationColor(): HasOne
    {
        return $this->hasOne(UserAnnotationColor::class);
    }
}
