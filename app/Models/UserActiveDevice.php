<?php

namespace App\Models;

use App\Events\UserLoggedInEvent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Browser;

class UserActiveDevice extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function allowedToLogin($user, $request, $type='web'){
        // if logging-in from same browser as before
        info('checking if user if allowed to login');
        $b_name = Browser::browserName();
        $b_p_f = Browser::platformFamily();
        $b_p_n = Browser::platformName();
        $ip = $request->ip();
        info(print_r($b_name));
        info(print_r($b_p_f));
        info(print_r($b_p_n));
        info(print_r($ip));


        $devices = UserActiveDevice::where('user_id', $user->id)->get();
        foreach ($devices as $device) {
            if ($device->browser_name == $b_name && $device->platform_name == $b_p_f && $device->device_type == $b_p_n && $device->ip == $ip) {
                return true;
            }
        }

        $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;

        // if user is not allowed to login
        if ($allowed_logins == -1){
            return false;
        }
        // if unlimited logins are allowed
        else if ($allowed_logins == 0){
            return true;
        }

        $allowed_browsers_count = $allowed_logins;
        $allowed_extensions_count = $allowed_logins;

        $active_browsers_count = self::query()->where('user_id', $user->id)->where('is_extension', false)->get()->count();
        $active_extensions_count = self::query()->where('user_id', $user->id)->where('is_extension', true)->get()->count();

        if ($type == 'web'){
            if ($active_browsers_count < $allowed_browsers_count){
                UserLoggedInEvent::dispatch($user, $request, $type);
                return true;
            }
            else{
                return false;
            }
        }

        if ($type == 'ext'){
            if ($active_extensions_count < $allowed_extensions_count){
                UserLoggedInEvent::dispatch($user, $request, $type);
                return true;
            }
            else{
                return false;
            }
        }

    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

}
