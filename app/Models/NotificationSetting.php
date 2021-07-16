<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        
        'is_enabled',
        
        // 'name',
        // 'label',

        'email_seven_days_before',
        'email_one_days_before',
        'email_on_event_day',

        'browser_notification_on_event_day',

        'sms_on_event_day',

        // 'user_id'
    ];
}
