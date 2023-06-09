<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotificationSettingRequest;
use App\Models\NotificationSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class NotificationSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $notificationSettings = NotificationSetting::ofCurrentUser()->get()->toArray();
        return ['notification_settings' => $notificationSettings];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\NotificationSetting  $notificationSetting
     * @return \Illuminate\Http\Response
     */
    public function update(NotificationSettingRequest $request, NotificationSetting $notificationSetting)
    {

        if ($notificationSetting->user_id == Auth::id()) {
            $notificationSetting->fill($request->validated());
            $notificationSetting->save();

            return ['notification_setting' => $notificationSetting];
        } else {
            abort(404, 'Unable to find Notification Setting for the given id.');
        }
    }
}
