<?php

namespace App\Http\Controllers;

use App\Repositories\GithubAutomationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GithubAutomationController extends Controller
{
    public $githubAutomationRepository;

    public function __construct()
    {
        $this->githubAutomationRepository = new GithubAutomationRepository();
    }

    public function redirectGithub()
    {
        return Socialite::driver('github')
            ->scopes(['admin:org', 'repo', 'user'])
            ->redirect();
    }

    /**
     * @return RedirectResponse
     */
    public function callbackGithub()
    {
        try {
            $user = Socialite::driver('github')->user();

            if ($user) {
                /*
                 * Store github account, pages, ad account and other information if it does not exist
                 * */
                $this->githubAutomationRepository->setupGithubAccount($user->token, $user->expiresIn, $user->id, $user->email, $user->avatar, $user->nickname, $user->refreshToken);

                Auth::user()->is_ds_github_tracking_enabled = true;
                Auth::user()->save();
                return redirect()->to('data-source?show_github_popup=1')->with('Account connected. You can enable the automation now.');

            } else {
                return redirect()->to('data-source')->with('Account not connected.');
            }
        } catch (\Exception$exception) {
            return redirect()->to('data-source')->with($exception->getMessage());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function userGithubAccountsExists(Request $request): JsonResponse
    {
        return $this->githubAutomationRepository->userGithubAccountsExists();
    }

    public function getRepositories()
    {
        return $this->githubAutomationRepository->getRepositories();
    }
}
