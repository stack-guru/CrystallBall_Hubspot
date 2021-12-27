<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification as BaseNotification;
use App\Models\NotificationLog;
use Illuminate\Support\Carbon;

class Notification extends BaseNotification
{

    public function logNotificationTrigger($notifiableId, $entityId, $notificationName, $notificationChannel)
    {
        $notificationLog = new NotificationLog;
        $notificationLog->user_id = $notifiableId;
        $notificationLog->entity_id = $entityId;
        $notificationLog->notification_name = $notificationName;
        $notificationLog->notification_channel = $notificationChannel;
        $notificationLog->created_at = Carbon::now();
        $notificationLog->save();
    }
}
