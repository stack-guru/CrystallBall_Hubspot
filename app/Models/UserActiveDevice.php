<?php

namespace App\Models;

use App\Events\UserLoggedInEvent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class UserActiveDevice extends Model
{
    use HasFactory;

    protected $guarded = [];
    public static function allowedToLogin($user, $request, $type='web'){
        $allowed_logins = (int)$user->pricePlan->users_devices_count ?? 2;
        $active_sessions_of_user = self::query()->where('user_id', $user->id)->get()->count();

        if($active_sessions_of_user >= $allowed_logins){
            return false;
        }

        // create new active device
        UserLoggedInEvent::dispatch($user, $request, $type);

        return true;
    }

}
