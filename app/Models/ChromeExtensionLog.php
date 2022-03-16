<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChromeExtensionLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    const ANNOTATION_CREATED = 'AnnotationCreated';
    const POPUP_OPENED = 'PopupOpened';
    const ANNOTATION_BUTTON_CLICKED = 'AnnotationButtonClicked';

    protected $fillable = [

        'event_name',

    ];
}
