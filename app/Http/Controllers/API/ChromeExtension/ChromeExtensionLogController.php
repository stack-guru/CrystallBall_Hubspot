<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChromeExtensionLog;
use Carbon\Carbon;
use App\Http\Requests\ChromeExtensionLogRequest;
use Illuminate\Support\Facades\Auth;

class ChromeExtensionLogController extends Controller
{
    public function store (ChromeExtensionLogRequest $request){
        $chromeExtensionLog = new ChromeExtensionLog;
        $chromeExtensionLog->fill($request->validated());

        $chromeExtensionLog->created_at = Carbon::now();
        $chromeExtensionLog->user_id = Auth::id();
        $chromeExtensionLog->ip_address = $request->ip();
        $chromeExtensionLog->bearer_token = $request->bearerToken();

        $chromeExtensionLog->save();
        
        return ['success' => true];
    }
}
