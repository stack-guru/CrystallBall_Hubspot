<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use App\Http\Requests\NotificationSettingRequest;

class NotificationSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $notificationSettings = NotificationSetting::where('user_id', Auth::id())->get()->toArray();
          $user=User::find(Auth::id());
        return ['notification_settings' => $notificationSettings,'user'=>$user];
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
        
        if($notificationSetting->user_id == Auth::id()){
            $notificationSetting->fill($request->validated());
            $notificationSetting->save();

            return ['notification_setting' => $notificationSetting];
        }else{
            abort(403);
        }

    }

}
