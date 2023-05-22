<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        $user = Auth::user();
        $users = [
            ['id' => '*', 'name' => 'All Users'],
        ];

        $users[] = ['id' => $user->id, 'name' => $user->name];

        $oUsers = ($user->user_id ? $user->user->users() : $user->users())->get(['id', 'name'])->toArray();
        if (count($oUsers)) {
            $users = array_merge($users, $oUsers);
        }

        return ['users' => $users];
    }
}
