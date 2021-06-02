<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use Auth;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        $user = Auth::user();
        $users = [
            ['id' => '*', 'name' => 'No Filter'],
        ];

        $oUsers = ($user->user_id ? $user->user->users() : $user->users())->get(['id', 'name'])->toArray();
        if (count($oUsers)) {
            array_push($users, $oUsers);
        }

        return ['users' => $users];
    }
}
