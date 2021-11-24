<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserWebhookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserWebhook;

class UserWebhookController extends Controller
{
    public function store(UserWebhookRequest $request)
    {
        $userWebhook = new UserWebhook;
        $userWebhook->fill($request->validated());
        $userWebhook->user_id = Auth::id();
        $userWebhook->save();

        return ['user_webhook' => $userWebhook];
    }

    public function destroy(UserWebhook $userWebhook)
    {
        if ($userWebhook->user_id !== Auth::id()) {
            abort(404);
        }

        $userWebhook->delete();

        return ['success' => true];
    }
}
