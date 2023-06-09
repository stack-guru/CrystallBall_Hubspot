<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class annotation extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

        $combineAnnotations=[];
  foreach($this->all() as $annotation){
      array_push($combineAnnotations,[
          "_id" =>$annotation->id,
          "category" => $annotation->category,
          "eventSource" => [
              "name" => $annotation->event_name,
          ],
          "url" => $annotation->url,
          "description" => $annotation->description,
          "highlighted" => false,
          "publishDate" =>  Carbon::parse($annotation->show_at)->format('Y-m-dTH:i:sZ'), //"2020-08-30T00:00:00.000Z"
      ]);
  }
    return $combineAnnotations;
    }
}
