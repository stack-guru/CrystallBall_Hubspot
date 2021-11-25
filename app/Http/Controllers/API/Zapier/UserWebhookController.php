<?php

namespace App\Http\Controllers\API\Zapier;

use App\Http\Requests\UserWebhookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserWebhook;
use App\Http\Controllers\Controller;

class UserWebhookController extends Controller
{
    public function store(UserWebhookRequest $request)
    {
        $userWebhook = new UserWebhook;
        $userWebhook->fill($request->validated());
        $userWebhook->user_id = Auth::id();
        $userWebhook->endpoint_name = 'ZAPIER';
        $userWebhook->save();

        return ['user_webhook' => $userWebhook];
    }

    public function destroy(UserWebhook $userWebhook)
    {
        if ($userWebhook->user_id !== Auth::id() && $userWebhook->endpoint_name !== 'ZAPIER') {
            abort(404);
        }

        $userWebhook->delete();

        return ['success' => true];
    }
}
