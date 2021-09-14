<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserChecklistItem extends Model
{
    use HasFactory;

    public function checklistItem(){
        return $this->belongsTo(ChecklistItem::class);
    }
}
