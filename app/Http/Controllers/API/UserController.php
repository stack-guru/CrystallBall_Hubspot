<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;

class UserController extends Controller
{
    public function extensionShowMembership()
    {
        $user = User::find(Auth::id());
        return [
            "members" => [
                [
                    "_id" => $user->id,
                    "user" => [
                        "local" => [
                            "email" => $user->email,
                        ],
                    ],
                    "organization" => [
                        "_id" => $user->id,
                        "name" => "Default organization",
                        "__v" => 0,
                        "KPISources" => [],
                        "eventSources" => [],
                        "members" => [
                            $user->id,
                        ],
                    ],
                    "role" => "admin",
                    "__v" => 0,
                ],
            ],
        ];
    }
}
