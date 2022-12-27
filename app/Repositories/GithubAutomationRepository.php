<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserGithubAccount;
use App\Services\GithubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class GithubAutomationRepository
{
    protected $githubService;

    public function __construct()
    {
        $this->githubService = new GithubService();
    }

    /**
     * @param $bb_account_id
     * @param $user_github_accounts
     * @return bool
     */
    public function userGithubAccountExistsByGithubAccountId($bb_account_id, $user_github_accounts): bool
    {
        foreach ($user_github_accounts as $user_github_account) {
            if ($user_github_account->github_account_id == $bb_account_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     */
    public function setupGithubAccount($user_token, $expiresIn, $github_account_id, $email, $avatar, $name, $refresh_token)
    {
        $user_github_account = $this->storeGithubAccount($user_token, $expiresIn, $github_account_id, $email, $avatar, $name, $refresh_token); // returns obj
        if ($user_github_account) {
            // store Github pages and posts
            $this->githubService->authenticate($user_github_account->token);
        }
    }

    public function getRepositories()
    {
        try {
            $user_github_accounts = \auth()->user()->github_accounts;
            if ($user_github_accounts->count() > 0) {
                $this->githubService->authenticate($user_github_accounts[0]->token);
                $workspaces = $this->githubService->getRepositories($user_github_accounts[0]->name);
            } else {
                $workspaces = [];
            }
        } catch (\Exception $e) {
            dd($e);
        }
        return $workspaces;
    }

    /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     * @return UserGithubAccount|false
     */
    public function storeGithubAccount($token, $expiresIn, $github_account_id, $email, $avatar, $name, $refresh_token)
    {
        $user_github_account = UserGithubAccount::where('github_account_id', $github_account_id)->where('user_id', \auth()->user()->id)->first();
        if ($user_github_account) {
            $user_github_account->name = $name;
            $user_github_account->token = $token;
            $user_github_account->token_expires_at = $expiresIn;
            $user_github_account->github_user_email = $email;
            $user_github_account->github_avatar_url = $avatar;
            $user_github_account->refresh_token = $refresh_token;
        } else {
            $user_github_account = new UserGithubAccount;
            $user_github_account->user_id = \auth()->user()->id;
            $user_github_account->name = $name;
            $user_github_account->token = $token;
            $user_github_account->token_expires_at = $expiresIn;
            $user_github_account->github_account_id = $github_account_id;
            $user_github_account->github_user_email = $email;
            $user_github_account->github_avatar_url = $avatar;
            $user_github_account->refresh_token = $refresh_token;
        }

        if ($user_github_account->save()) {
            return $user_github_account;
        } else {
            return false;
        }
    }

    /*
     * Check if user has Github accounts exists
     * */
    /**
     * @return JsonResponse
     */
    public function userGithubAccountsExists(): JsonResponse
    {
        try {
            $user_github_accounts = \auth()->user()->github_accounts;
            if ($user_github_accounts->count() > 0) {
                $this->githubService->authenticate($user_github_accounts[0]->token);

                if ($this->githubService->getCurrentUser()->show()) {
                    $exists = true;
                } else {
                    $exists = false;
                }

            } else {
                $exists = false;
            }
            $error = null;
        } catch (\Exception $e) {
            $exists = false;
            $error = $e->getMessage();
        }
        return response()->json([
            'exists' => $exists,
            'error' => $error,
        ]);
    }

    public function updateGithubAccountData($github_account)
    {
        $this->storeGithubPages($github_account->token, $github_account->github_account_id);
    }

}
