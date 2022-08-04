<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserFacebookPageController extends Controller
{
    public function index()
    {
        $facebook_pages = [];

        $user_facebook_accounts = \auth()->user()->facebook_accounts;
        foreach ($user_facebook_accounts as $user_facebook_account) {
            $user_facebook_account_pages = $user_facebook_account->pages;
            foreach ($user_facebook_account_pages as $user_facebook_account_page) {
                array_push($facebook_pages, [
                    'label' => $user_facebook_account_page->facebook_page_name,
                    'value' => $user_facebook_account_page->id,
                ]);
            }
        }

        return response()->json(
            [
                'facebook_pages' => $facebook_pages,
            ]
        );
    }
}
