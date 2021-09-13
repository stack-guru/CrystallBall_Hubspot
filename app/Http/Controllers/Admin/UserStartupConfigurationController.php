<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserStartupConfigurationController extends Controller {
    public function index(){
        $users = User::with('userStartupConfigurations')->orderBy('created_at', 'DESC')->get();

        return view('admin/user-startup-configuration/index')->with('users', $users);
    }
}