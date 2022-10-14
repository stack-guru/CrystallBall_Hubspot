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

    public static function allowedToLogin($user, $request, $type){
        // if logging-in from same browser as before
        $b_name = Browser::browserName();
        $b_p_f = Browser::platformFamily();
        $b_p_n = Browser::platformName();
        $ip = $request->ip();

        $browsers = self::query()->where('user_id', $user->id)->where('is_extension', false)->get();
        $extensions = self::query()->where('user_id', $user->id)->where('is_extension', true)->get();

        // check if user has logged in from same browser or extension
        // in that case we dont need to check the credits

        if ($type == 'web'){
            foreach ($browsers as $browser) {
                if ($browser->browser_name == $b_name && $browser->platform_name == $b_p_f && $browser->device_type == $b_p_n && $browser->ip == $ip) {
                    return true;
                }
            }
        }
        else if($type == 'ext'){
            foreach ($extensions as $extension) {
                if ($extension->browser_name == $b_name && $extension->platform_name == $b_p_f && $extension->device_type == $b_p_n && $extension->ip == $ip) {
                    return true;
                }
            }
        }

        // user has not logged in before
        // now check credits if user can login

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
                // this event creates new database entry for user devices
                UserLoggedInEvent::dispatch($user, $request, $type);
                return true;
            }
            else{
                return false;
            }
        }

        if ($type == 'ext'){
            if ($active_extensions_count < $allowed_extensions_count){
                // this event creates new database entry for user extensions
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
