<?php

namespace App\Helpers;

use App\Models\GithubCommitAnnotation;
use App\Services\GithubService;
use github\Exception\RuntimeException as GithubRuntimeException;

class GitHubCommitHelper
{
    public static function fetch($data_source)
    {
        $githubService = new GithubService;

            $user_github_accounts = $data_source->user->github_accounts;

            if (count($user_github_accounts) > 0) {
                $githubService->authenticate($user_github_accounts[0]->token);
            }

            $workspace = $data_source->workspace;
            $repository = $data_source->value;
            $user_id = $data_source->user_id;

            try {
                $commits = $githubService->getCommits($workspace, $repository);
                foreach ($commits as $key => $commit) {

                    $hash = $commit['sha'];
                    $author = $commit['commit']['author']['name'];
                    $message = $commit['commit']['message'];
                    $link = $commit['html_url'];
                    $category = $data_source->ds_name;
                    $date = $commit['commit']['author']['date'];

                    GitHubCommitHelper::precessResult($user_id, $message, $category, $hash, $author, $date, $link);
                }
            } catch (GithubRuntimeException $e) {
                print $e;
            }


        return 0;
    }
    public static function precessResult($user_id, $message, $category, $hash, $author, $date, $link) {
        $words = explode(" ", $message);

        $words_array = array_chunk($words, 4);

        $event_name = implode(" ", $words_array[0]);
        $hash_convert_array = str_split($hash, 7);
        $hash_convert_str = $hash_convert_array[0];
        $show_at = (new \DateTime($date))->format('Y-m-d');

        GithubCommitAnnotation::updateOrCreate([
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
