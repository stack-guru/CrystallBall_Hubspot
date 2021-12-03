<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserChecklistItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class UserChecklistItemController extends Controller
{
    public function index(){
        $userId = Auth::id();
        return [
            'user_checklist_items' => UserChecklistItem::with('checklistItem')->where('user_id', $userId)->get()
        ];
    }

    public function update(Request $request, UserChecklistItem $userChecklistItem){
        $userChecklistItem->last_viewed_at = Carbon::now();
        if($request->has('completed_at')){
            $userChecklistItem->completed_at = Carbon::now();
        }
        $userChecklistItem->save();

        $userChecklistItem->load('checklistItem');
        return ['user_checklist_item' => $userChecklistItem];
    }
}
