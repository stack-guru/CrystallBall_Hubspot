<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChromeExtensionLog;
use App\Models\User;
use Illuminate\Http\Request;

class ChromeExtensionLogController extends Controller
{
    public function index(Request $request)
    {
        $this->validate($request, [
            'user_id' => 'bail|required|numeric|exists:users,id'
        ]);

        $user = User::find($request->query('user_id'));
        $chromeExtensionLogs = ChromeExtensionLog::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();

        return view('admin/chrome-extension-log/index')
            ->with('user', $user)
            ->with('chromeExtensionLogs', $chromeExtensionLogs);
    }
}
