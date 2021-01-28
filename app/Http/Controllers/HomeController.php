<?php

namespace App\Http\Controllers;

use App\Mail\SupportRequestMail;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function uiUserShow()
    {
        $user = Auth::user();
        $user->load('pricePlan');
        if ($user->last_login_at == null) {
            User::where('id', $user->id)
                ->update([
                    'last_login_at' => new \DateTime,
                ]);
        }

        return ['user' => $user];
    }

    public function userServices(Request $request)
    {

        $user = Auth::user();
        if (!$user->pricePlan->has_data_sources) {
            abort(402);
        }

        if ($request->has('is_ds_holidays_enabled')) {
            $user->is_ds_holidays_enabled = $request->is_ds_holidays_enabled;
            if($request->is_ds_holidays_enabled) $user->last_activated_any_data_source_at = Carbon::now();
            $user->save();
        }
        if ($request->has('is_ds_google_algorithm_updates_enabled')) {
            $user->is_ds_google_algorithm_updates_enabled = $request->is_ds_google_algorithm_updates_enabled;
            if($request->is_ds_google_algorithm_updates_enabled) $user->last_activated_any_data_source_at = Carbon::now();
            $user->save();
        }
        if ($request->has('is_ds_retail_marketing_enabled')) {
            $user->is_ds_retail_marketing_enabled = $request->is_ds_retail_marketing_enabled;
            if($request->is_ds_retail_marketing_enabled) $user->last_activated_any_data_source_at = Carbon::now();
            $user->save();
        }   
        if ($request->has('is_ds_weather_alerts_enabled')) {
            $user->is_ds_weather_alerts_enabled = $request->is_ds_weather_alerts_enabled;
            if($request->is_ds_weather_alerts_enabled) $user->last_activated_any_data_source_at = Carbon::now();
            $user->save();
        }

        return ['user_services' => $user];

    }

    public function storeSupport(Request $request)
    {
        $this->validate($request, [
            'details' => 'required|string',
            'attachment' => 'nullable|file',
        ]);

        if ($request->hasFile('attachment')) {
            $sRM = new SupportRequestMail(Auth::user(), $request->details, $request->file('attachment')->path(), $request->file('attachment')->getClientOriginalExtension());
        } else {
            $sRM = new SupportRequestMail(Auth::user(), $request->details);
        }
        Mail::to(config('sl.support.email'))->send($sRM);

        return ['sucess' => true];
    }

}
