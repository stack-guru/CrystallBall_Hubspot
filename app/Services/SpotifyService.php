<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\Factory;

class SpotifyService
{

    /**
     * @var \Illuminate\Http\Client\Factory
    */
    private $client;

    /**
     * @var string
     */
    private $baseUrl = 'https://api.spotify.com/v1/';

    public function __construct(Factory $client)
    {
        $token = 'BQBzRWgaX7t-T-q6l8SsyxG1E2gzdHohKgjpE7xiWAG6PwEY7SOTzYKvsksTftU7g_kRKO3ttyam87yGvmOfbYzEPzRh1KxPZ_weSqVfRye43CwPSGOKJuaHr-2gNN3SV3dYriGSsmA59WKOryrM-NqeHKUBOJTIyj3mRptj0f98BrvuNAo--HVtbTLaZBbpJIWtmuY4CVDPP9N-Ty-n1Y3LY4VeBwcINIwyYwZ58-68HIu4Cit0c3lvU_MEt7SQuSGMVwY';
        $this->client = $client->withToken($token);
    }

    public function getPlaylist(string $id)
    {
        $response = $this->client->get($this->baseUrl.'albums/'. $id);

        if($response->failed()){
            return false;
        }

        return $response->json();
    }

}
