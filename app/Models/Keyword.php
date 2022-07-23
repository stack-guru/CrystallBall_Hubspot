<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keyword extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function user_data_source()
    {
        return $this->belongsTo(UserDataSource::class);
    }

    public function configurations(){
        return $this->belongsToMany(KeywordConfiguration::class, 'keyword_metas', 'keyword_id', 'keyword_configuration_id')->select('keyword_configurations.id', 'url', 'language', 'location_code', 'search_engine', 'ranking_direction', 'ranking_places_changed', 'is_url_competitors');
    }
}
