<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UserChecklistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'checklist_item_id', 'user_id'
    ];

    public function checklistItem()
    {
        return $this->belongsTo(ChecklistItem::class);
    }
    
    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

}
