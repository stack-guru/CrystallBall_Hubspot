<?php

namespace App\Models;

use App\Events\UserLoggedInEvent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use DeviceDetector\Parser\Client\Browser;

class UserActiveDevice extends Model
{
    use HasFactory;

    protected $guarded = [];
    
    public static function allowedToLogin($user, $request, $type='web'){
        // if logging-in from same browser as before
        $b_name = Browser::browserName();
        $b_p_f = Browser::platformFamily();
        $b_p_n = Browser::platformName();
        $ip = $request->ip();

        $devices = UserActiveDevice::where('user_id', $user->id)->get();
        foreach ($devices as $device) {
            if ($device->browser_name == $b_name && $device->platform_name == $b_p_f && $device->device_type == $b_p_n && $device->ip == $ip) {
                return true;
            }
        }

        $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
        $active_sessions_of_user = self::query()->where('user_id', $user->id)->get()->count();
        if ($active_sessions_of_user >= $allowed_logins) {
            return false;
        }
        // create new active device
        UserLoggedInEvent::dispatch($user, $request, $type);
        return true;

    }

}
