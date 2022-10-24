<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Services\UptimeRobotService;

class WebMonitor extends Model
{
    use HasFactory;

    protected $fillable = [

        'name',
        'url',
        'email_address',
        'sms_phone_number',
        'ga_property_id',
        // 'uptime_robot_id',
        // 'last_status',
        // 'last_synced_at',

    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @deprecated Use the "casts" property
     *
     * @var array
     */
    protected $dates = [
        'last_synced_at'
    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    /**
     * Get the user that owns the WebMonitor
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the gaProperty that owns the WebMonitor
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAnalyticsProperty(): BelongsTo
    {
        return $this->belongsTo(GoogleAnalyticsProperty::class, 'ga_property_id', 'id');
    }

    static public function removeAdditionalWebMonitors($user, $maxAllowedWebMonitors)
    {
        $webMonitors = $user->webMonitors()->whereNotNull('uptime_robot_id')->orderBy('name', 'ASC')->get();

        $uptimeRobotService = new UptimeRobotService;
        foreach ($webMonitors as $index => $webMonitor) {
            if ($index >= $maxAllowedWebMonitors) {
                $anyOldMonitor = WebMonitor::where('uptime_robot_id', $webMonitor->uptime_robot_id)->where('id', '<>', $webMonitor->id)->first();
                if (!$anyOldMonitor) {
                    $uptimeRobotService->deleteMonitor($webMonitor->uptime_robot_id);
                }
                $webMonitor->uptime_robot_id = null;
                $webMonitor->save();
            }
        }
    }

    static public function addAllowedWebMonitors($user, $maxAllowedWebMonitors)
    {
        $webMonitors = $user->webMonitors()->orderBy('uptime_robot_id', 'DESC')->orderBy('name', 'ASC')->get();

        $uptimeRobotService = new UptimeRobotService;
        foreach ($webMonitors as $index => $webMonitor) {
            if ($webMonitor->uptime_robot_id == null) {
                if ($index < $maxAllowedWebMonitors) {
                    $anyOldMonitor = WebMonitor::where('url', $webMonitor->url)->whereNotNull('uptime_robot_id')->first();
                    if ($anyOldMonitor) {
                        $webMonitor->uptime_robot_id = $anyOldMonitor->uptime_robot_id;
                        $webMonitor->save();
                    } else {
                        $newMonitor = $uptimeRobotService->newMonitor($webMonitor->name, $webMonitor->url);
                        if ($newMonitor) {
                            $webMonitor->uptime_robot_id = $newMonitor['monitor']['id'];
                            $webMonitor->save();
                        }
                    }
                }
            }
        }
    }
}
