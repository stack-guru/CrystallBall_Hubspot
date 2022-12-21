<?php

namespace App\Console\Commands;

use App\Models\UserDataSource;
use App\Services\GithubService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DateTime;
use App\Models\GithubCommitAnnotation;

class FetchGithubCommit extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-github-commits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch github commits using saved repositories in database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user_data_sources = UserDataSource::where('ds_code', 'github_tracking')->get();
        $githubService = new GithubService;

        foreach ($user_data_sources as $data_source) {
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
                    $category = "Github";
                    $date = $commit['commit']['author']['date'];

                    $this->precessResult($user_id, $message, $category, $hash, $author, $date, $link);
                }
            } catch (github\Exception\RuntimeException$e) {
                print $e;
            }

        }

        return 0;
    }

    public function precessResult($user_id, $message, $category, $hash, $author, $date, $link) {
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
