<?php

namespace App\Helpers;

use App\Models\BitbucketCommitAnnotation;
use App\Services\BitbucketService;
use Bitbucket\Exception\RuntimeException as BitbucketRuntimeException;

class BitbucketCommitHelper
{
    public static function fetch($data_source)
    {
        $bitbucketService = new BitbucketService;
        $user_bitbucket_accounts = $data_source->user->bitbucket_accounts;
        if (count($user_bitbucket_accounts) > 0) {
            $bitbucketAccount = $bitbucketService->refreshToken($user_bitbucket_accounts[0]);
            $bitbucketService->authenticate($bitbucketAccount->token);
        }

        $workspace = $data_source->workspace;
        $repository = $data_source->value;
        $user_id = $data_source->user_id;

        try {
            $commits = $bitbucketService->getCommits($workspace, $repository);
            foreach ($commits as $key => $commit) {
                $type = $commit['type'];
                $hash = $commit['hash'];
                $date = $commit['date'];
                if (isset($commit['author']['user'])) {
                    $author = $commit['author']['user']['display_name'];
                } else {
                    $author = "root";
                }
                $message = $commit['message'];
                $link = $commit['links']['html']['href'];
                $category = $data_source->ds_name;
                $date = $commit['date'];

                BitbucketCommitHelper::precessResult($user_id, $message, $category, $hash, $author, $date, $link);
            }
        } catch (BitbucketRuntimeException $e) {
            print $e;
        }


        return 0;
    }
    public static  function precessResult($user_id, $message, $category, $hash, $author, $date, $link) {
        $words = explode(" ", $message);

        $words_array = array_chunk($words, 4);

        $event_name = implode(" ", $words_array[0]);
        $hash_convert_array = str_split($hash, 7);
        $hash_convert_str = $hash_convert_array[0];
        $show_at = (new \DateTime($date))->format('Y-m-d');

        BitbucketCommitAnnotation::updateOrCreate([
            'user_id' => $user_id,
            'description' => "Commit ".$hash_convert_str.":".$message." by ".$author,
        ],
        [
            'category' => $category,
            'event_name' => $event_name,
            'url'=>$link,
            'show_at' => $show_at
        ]);
    }
}
