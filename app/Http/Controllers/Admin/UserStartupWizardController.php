<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserStartupWizardController extends Controller {
    public function index(){
        $users = User::with('userStartupWizards')->orderBy('created_at', 'DESC')->get();

        return view('admin/user-startup-wizard/index')->with('users', $users);
    }
}