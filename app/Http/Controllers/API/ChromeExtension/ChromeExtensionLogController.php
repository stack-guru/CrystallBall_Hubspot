<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChromeExtensionLog;
use Illuminate\Support\Carbon;
use App\Http\Requests\ChromeExtensionLogRequest;
use Illuminate\Support\Facades\Auth;

class ChromeExtensionLogController extends Controller
{
    public function store(ChromeExtensionLogRequest $request)
    {
        $chromeExtensionOldLogsCount = ChromeExtensionLog::where('user_id', Auth::id())
            ->where('event_name', ChromeExtensionLog::ANNOTATION_BUTTON_CLICKED)
            ->count();

        $chromeExtensionLog = new ChromeExtensionLog;
        $chromeExtensionLog->fill($request->validated());

        $chromeExtensionLog->created_at = Carbon::now();
        $chromeExtensionLog->user_id = Auth::id();
        $chromeExtensionLog->ip_address = $request->ip();
        $chromeExtensionLog->bearer_token = $request->bearerToken();

        $chromeExtensionLog->save();

        switch ($chromeExtensionLog->event_name) {
            case ChromeExtensionLog::ANNOTATION_BUTTON_CLICKED:
                if (!$chromeExtensionOldLogsCount) event(new \App\Events\UserClickedAnnotationButtonInBrowser(Auth::user()));
                break;

            case ChromeExtensionLog::ANNOTATION_CREATED:

                break;
        }
        return ['success' => true];
    }
}
