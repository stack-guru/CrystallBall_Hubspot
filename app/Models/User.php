<?php

namespace App\Models;

use Auth;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Carbon\carbon;

class User extends Authenticatable implements MustVerifyEmail
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

        'data_source_tour_showed_at',
        'google_accounts_tour_showed_at',
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

    public function lastLoginLog()
    {
        return $this->hasOne('App\Models\LoginLog')->orderBy('created_at', 'DESC');
    }

    public function last30DaysApiAnnotationCreatedLogs(){
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', 'AnnotationCreated')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'DESC');
    }

    public function AnnotationButtonClickedChromeExtensionLogs(){
        return $this->hasMany('App\Models\ChromeExtensionLog')
            ->where('event_name', 'AnnotationButtonClicked')
            ->orderBy('created_at', 'DESC');
    }

    public function lastAnnotationButtonClickedChromeExtensionLog(){
        return $this->hasOne('App\Models\ChromeExtensionLog')
            ->where('event_name', 'AnnotationButtonClicked')
            ->orderBy('created_at', 'DESC');
    }

    public function lastApiLog()
    {
        return $this->hasOne('App\Models\ApiLog')->orderBy('created_at', 'DESC');
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
