<?php

namespace App\Models;

use App\Scopes\ActiveStatusScope;
use App\Traits\MustVerifyPhone;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;
use App\Helpers\AnnotationQueryHelper;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens, MustVerifyPhone;

    public $pushNotificationType = 'users';

    const ADMIN  = 'admin';
    const TEAM   = 'team';
    const VIEWER = 'viewer';

    const STATUS_ACTIVE    = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_DELETED   = 'deleted';

    const EMPTY_PASSWORD = '.';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'has_password',
        'price_plan_id',
        'price_plan_expiry_date',
        'price_plan_settings',

        'is_ds_web_monitors_enabled',
        'is_ds_google_alerts_enabled',
        'is_ds_google_algorithm_updates_enabled',
        'is_ds_retail_marketing_enabled',
        'is_ds_holidays_enabled',
        'is_ds_weather_alerts_enabled',
        'is_ds_wordpress_updates_enabled',
        'is_ds_keyword_tracking_enabled',
        'is_ds_facebook_tracking_enabled',
        'is_ds_instagram_tracking_enabled',
        'is_ds_bitbucket_tracking_enabled',
        'is_ds_shopify_annotation_enabled',
        'is_ds_github_tracking_enabled',
        'is_ds_apple_podcast_annotation_enabled',
        'is_ds_g_ads_history_change_enabled',
        'is_ds_twitter_tracking_enabled',
        'is_ds_anomolies_detection_enabled',
        'is_ds_budget_tracking_enabled',

        'user_level',
        'department',

        'team_name',

        'data_source_tour_showed_at',
        'google_accounts_tour_showed_at',
        'startup_configuration_showed_at',

        'last_screenshot_of_report_at',
        // app_sumo_uuid
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
        "last_api_called_at",

        "phone_verification_code",
        "phone_verification_expiry",

        'app_sumo_uuid',
        'identification_code',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at'                      => 'datetime',
        'phone_verified_at'                      => 'datetime',
        'price_plan_expiry_date'                 => 'date',
        'price_plan_settings'                    => 'json',
        'last_login_at'                          => 'datetime',
        'trial_ended_at'                         => 'datetime',
        'data_source_tour_showed_at'             => 'datetime',
        'google_accounts_tour_showed_at'         => 'datetime',
        'startup_configuration_showed_at'        => 'datetime',

        'is_ds_holidays_enabled'                 => 'boolean',
        'is_ds_google_algorithm_updates_enabled' => 'boolean',
        'is_ds_retail_marketing_enabled'         => 'boolean',
        'is_ds_weather_alerts_enabled'           => 'boolean',
        'is_ds_google_alerts_enabled'            => 'boolean',
        'is_ds_wordpress_updates_enabled'        => 'boolean',
        'is_ds_web_monitors_enabled'             => 'boolean',
        'is_ds_g_ads_history_change_enabled'     => 'boolean',
        'is_ds_anomolies_detection_enabled'      => 'boolean',
        'is_ds_budget_tracking_enabled'          => 'boolean',
        'is_ds_instagram_tracking_enabled'       => 'boolean',
        'is_ds_twitter_tracking_enabled'         => 'boolean',

        "last_logged_into_extension_at"          => 'datetime',
        "last_activated_any_data_source_at"      => 'datetime',
        "last_generated_api_token_at"            => 'datetime',
        "last_api_called_at"                     => "datetime",

        "has_password" => 'boolean',

        "last_screenshot_of_report_at" => "datetime",
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['user'];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::addGlobalScope(new ActiveStatusScope);
    }

    public function pricePlan()
    {
        return $this->belongsTo('App\Models\PricePlan');
    }

    public function paymentDetails()
    {
        return $this->hasMany('App\Models\PaymentDetail');
    }

    public function lastPricePlanSubscription()
    {
        return $this->hasOne('App\Models\PricePlanSubscription')->orderBy('created_at', 'DESC');
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
        return $this->hasOne('App\Models\Annotation')->where('event_name', '<>', Annotation::SAMPLE_ANNOTATION_EVENT_NAME)->orderBy('created_at', 'DESC');
    }

    public function annotations()
    {
        return $this->hasMany('App\Models\Annotation');
    }

    public function manualAnnotations()
    {
        return $this->hasMany('App\Models\Annotation')->where('added_by', 'manual');
    }

    public function annotationGaProperties()
    {
        return $this->hasMany('App\Models\AnnotationGaProperty')->whereNotNull('google_analytics_property_id');
    }

    public function googleAccounts()
    {
        return $this->hasMany('App\Models\GoogleAccount');
    }

    public function twitterAccounts(): HasMany
    {
        return $this->hasMany(UserTwitterAccount::class, 'user_id', 'id');
    }

    public function twitterTrackingConfiguration(): HasOne
    {
        return $this->hasOne(TwitterTrackingConfiguration::class, 'user_id', 'id');
    }

    public function googleAnalyticsAccounts()
    {
        return $this->hasMany('App\Models\GoogleAnalyticsAccount');
    }

    public function googleAnalyticsProperties()
    {
        return $this->hasMany('App\Models\GoogleAnalyticsProperty');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }

    public function userGaAccounts()
    {
        return $this->hasMany('App\Models\UserGaAccount');
    }

    public function userRegistrationOffers()
    {
        return $this->hasMany('App\Models\UserRegistrationOffer');
    }

    public function pricePlanSubscriptions()
    {
        return $this->hasMany('App\Models\PricePlanSubscription');
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

    public function userStartupConfigurations()
    {
        return $this->hasMany(UserStartupConfiguration::class);
    }

    public function userChecklistItems()
    {
        return $this->hasMany(UserChecklistItem::class);
    }

    public function userStarterConfigurationChecklist()
    {
        return  $this->userChecklistItems->whereIn('checklist_item_id',['25','21','23']);
    }

    public function starterConfigurationChecklist()
    {
        return  ChecklistItem::whereIn('id',['25','21','23'])->get();
    }

    public function notificationSettings()
    {
        return $this->hasMany(NotificationSetting::class);
    }

    public function notificationSettingFor($settingName)
    {
        return NotificationSetting::where('name', $settingName)->where('user_id', $this->getKey())->first();
    }

    public function routeNotificationForPusherPushNotifications($notification)
    {
        return (string) $this->getKey();
    }

    public function routeNotificationForTwilio()
    {
        return $this->hasVerifiedPhone() ? (string) $this->phone_number : null;
    }

    /**
     * Route notifications for the Slack channel.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string
     */
    public function routeNotificationForSlack($notification)
    {
        return 'https://hooks.slack.com/services/...';
    }

    public function getAllGroupUserIdsArray($user = null): array
    {
        if ($user === null) {
            $user = $this;
        }

        $userIdsArray = [];

        if (!$user->user_id) {
            // Current user is not child, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        } else {
            // Current user is child, find admin, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to Admin so that data source configuration which applies are that of admin
            $user = $user->user;
        }

        return $userIdsArray;
    }

    public function getTotalAnnotationsCount($applyLimit)
    {
        $userIdsArray  = $this->getAllGroupUserIdsArray();
        $userPricePlan = $this->pricePlan;

        $annotationsQuery = "SELECT COUNT(*) AS total_annotations_count FROM (";
        $annotationsQuery .= "SELECT TempTable.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($this, '*', $userIdsArray, '*', true);
        $annotationsQuery .= ") AS TempTable";

        if ($userPricePlan->annotations_count > 0 && $applyLimit) {
            $annotationsQuery .= " LIMIT " . $userPricePlan->annotations_count;
        }
        $annotationsQuery .= ") AS TempTable2";

        $annotationsCount = DB::select($annotationsQuery)[0]->total_annotations_count;

        return $annotationsCount;
    }

    public function isPricePlanAnnotationLimitReached($applyLimit = false): bool
    {
        $userPricePlan    = $this->pricePlan;
        $annotationsCount = $this->getTotalAnnotationsCount($applyLimit);

        if ($userPricePlan->annotations_count > 0) {
            return $annotationsCount >= $userPricePlan->annotations_count;
        } else {
            return false;
        }
    }

    public function googleAnalyticsPropertiesInUse()
    {
        return $this->hasMany(GoogleAnalyticsProperty::class)->where('is_in_use', true);
    }

    public function getInUseGoogleAnalyticsPropertyCount()
    {
        return $this->googleAnalyticsProperties()->where('is_in_use', true)->count();
    }

    public function isPricePlanGoogleAnalyticsPropertyLimitReached(): bool
    {
        $userPricePlan                = $this->pricePlan;
        $googleAnalyticsPropertyCount = $this->getInUseGoogleAnalyticsPropertyCount();

        if ($userPricePlan->google_analytics_property_count > 0) {
            return $googleAnalyticsPropertyCount >= $userPricePlan->google_analytics_property_count;
        } else if ($userPricePlan->google_analytics_property_count == -1) {
            return true;
        } else {
            return false;
        }
    }

    public function lastLoginLog()
    {
        return $this->hasOne('App\Models\LoginLog')->orderBy('created_at', 'DESC');
    }

    public function loginLogs()
    {
        return $this->hasMany('App\Models\LoginLog');
    }

    public function last90DaysLoginLogs()
    {
        return $this->hasMany('App\Models\LoginLog')
            ->where('created_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('created_at', 'DESC');
    }

    public function yesterdayLoginLogs()
    {
        return $this->hasMany('App\Models\LoginLog')
            ->where('created_at', '>=', Carbon::now()->subDays(1))
            ->orderBy('created_at', 'DESC');
    }

    public function last60DaysLoginLogs()
    {
        return $this->hasMany('App\Models\LoginLog')
            ->where('created_at', '>=', Carbon::now()->subDays(60))
            ->orderBy('created_at', 'DESC');
    }

    public function last30DaysLoginLogs()
    {
        return $this->hasMany('App\Models\LoginLog')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'DESC');
    }

    public function allTimeLoginLogs()
    {
        return $this->hasMany('App\Models\LoginLog')
            ->orderBy('created_at', 'DESC');
    }

    public function last30DaysApiAnnotationCreatedLogs()
    {
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', ApiLog::ANNOTATION_CREATED)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'DESC');
    }

    public function yesterdayApiAnnotationCreatedLogs()
    {
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', ApiLog::ANNOTATION_CREATED)
            ->where('created_at', '>=', Carbon::now()->subDays(1))
            ->orderBy('created_at', 'DESC');
    }

    public function last90DaysApiAnnotationCreatedLogs()
    {
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', ApiLog::ANNOTATION_CREATED)
            ->where('created_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('created_at', 'DESC');
    }

    public function last60DaysApiAnnotationCreatedLogs()
    {
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', ApiLog::ANNOTATION_CREATED)
            ->where('created_at', '>=', Carbon::now()->subDays(60))
            ->orderBy('created_at', 'DESC');
    }

    public function allTimeApiAnnotationCreatedLogs()
    {
        return $this->hasMany('App\Models\ApiLog')
            ->where('event_name', ApiLog::ANNOTATION_CREATED)
            ->orderBy('created_at', 'DESC');
    }

    public function last30DaysPopupOpenedChromeExtensionLogs()
    {
        return $this->hasMany('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::POPUP_OPENED)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'DESC');
    }

    public function last90DaysPopupOpenedChromeExtensionLogs()
    {
        return $this->hasMany('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::POPUP_OPENED)
            ->where('created_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('created_at', 'DESC');
    }

    public function lastPopupOpenedChromeExtensionLog()
    {
        return $this->hasOne('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::POPUP_OPENED)
            ->orderBy('created_at', 'DESC');
    }

    public function lastAnnotationButtonClickedChromeExtensionLog()
    {
        return $this->hasOne('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::ANNOTATION_BUTTON_CLICKED)
            ->orderBy('created_at', 'DESC');
    }

    public function AnnotationButtonClickedChromeExtensionLogs()
    {
        return $this->hasMany('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::ANNOTATION_BUTTON_CLICKED)
            ->orderBy('created_at', 'DESC');
    }

    public function last90DaysAnnotationButtonClickedChromeExtensionLogs()
    {
        return $this->hasMany('App\Models\ChromeExtensionLog')
            ->where('event_name', ChromeExtensionLog::ANNOTATION_BUTTON_CLICKED)
            ->where('created_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('created_at', 'DESC');
    }

    public function lastApiLog()
    {
        return $this->hasOne('App\Models\ApiLog')->orderBy('created_at', 'DESC');
    }

    public function last90DaysNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')
            ->where('created_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('created_at', 'DESC');
    }

    public function yesterdayNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')
            ->where('created_at', '>=', Carbon::now()->subDays(1))
            ->orderBy('created_at', 'DESC');
    }

    public function last60DaysNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')
            ->where('created_at', '>=', Carbon::now()->subDays(60))
            ->orderBy('created_at', 'DESC');
    }

    public function last30DaysNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'DESC');
    }

    public function allTimeNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')
            ->orderBy('created_at', 'DESC');
    }

    public function notificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog');
    }

    public function emailNotificationLogs()
    {
        return $this->hasMany('App\Models\NotificationLog')->where('notification_channel', 'Mail');
    }

    /*
     * Facebook automation relationships
     * */
    /**
     * @return HasMany
     */
    public function facebook_accounts(): HasMany
    {
        return $this->hasMany(UserFacebookAccount::class, 'user_id');
    }

    /*
     * Instagram automation relationships
     * */
    /**
     * @return HasMany
     */
    public function instagram_accounts(): HasMany
    {
        return $this->hasMany(InstagramAccount::class, 'user_id');
    }

    /*
     * Bitbucket automation relationships
     * */
    /**
     * @return HasMany
     */
    public function bitbucket_accounts(): HasMany
    {
        return $this->hasMany(UserBitbucketAccount::class, 'user_id');
    }

    /*
     * Github automation relationships
     * */
    /**
     * @return HasMany
     */
    public function github_accounts(): HasMany
    {
        return $this->hasMany(UserGithubAccount::class, 'user_id');
    }
}
