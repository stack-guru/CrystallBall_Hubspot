<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GoogleAccount;
use Illuminate\Http\Request;

class GoogleAccountController extends Controller
{
    public function extensionIndex(Request $request)
    {

        return ['google_accounts' => array_merge(
            [
                ['id' => '*', 'name' => 'Default GA Account'],
            ],
            GoogleAccount::ofCurrentUser()->get()->toArray()
        )];
    }
}
