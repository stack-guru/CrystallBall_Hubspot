<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserChecklistItem;
use Illuminate\Support\Facades\Auth;

class UserChecklistItemController extends Controller
{
    public function index(){
        $userId = Auth::id();
        return [
            'user_checklist_items' => UserChecklistItem::with('checklistItem')->where('user_id', $userId)->get()
        ];
    }
}
