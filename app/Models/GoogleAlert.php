<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GoogleAlert extends Model
{
    use HasFactory;

    protected $fillable = [

        'category',
        'image',
        'title',
        'url',
        'description',
        'tag_name',

    ];

    /**
     * Get all of the userDataSources for the GoogleAlert
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userDataSources(): HasMany
    {
        return $this->hasMany(UserDataSource::class, 'value', 'tag_name');
    }

}
