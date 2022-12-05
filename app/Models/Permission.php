<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'source',
    ];

     /**
     * Get all of the spectators that are assigned this permission.
     */
    public function spectators(): MorphToMany
    {
        return $this->morphedByMany(Permission::class, 'permissionable');
    }
}
