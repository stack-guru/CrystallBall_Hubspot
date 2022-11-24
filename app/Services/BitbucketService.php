<?php

namespace App\Services;

use Bitbucket;

class BitbucketService
{
    private $bitbucket;

    public function __construct()
    {
        $client = new Bitbucket\Client();
        $client->authenticate(
            Bitbucket\Client::AUTH_OAUTH_TOKEN,
            '3KNblclyHCfjMEZ99H_kmLlvr7M0ZZ_lr0vuiTKFaHEycGeuoECRSNoXGzQOLIxBSDNneucJg5iqxhR0_1LSb2xbON-lzkP8yy8JqkT833lDZX1poZjVnW4UaRnBoSSx'
        );
        $currentUser = $client->currentUser()->show();
        // dd($currentUser);
    }
}
