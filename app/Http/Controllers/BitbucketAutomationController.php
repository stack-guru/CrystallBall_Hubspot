<?php

namespace App\Http\Controllers;

use App\Repositories\BitbucketAutomationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class BitbucketAutomationController extends Controller
{
    public $bitbucketAutomationRepository;

    public function __construct()
    {
        $this->bitbucketAutomationRepository = new BitbucketAutomationRepository();
    }

    public function redirectBitbucket()
    {
        return Socialite::driver('bitbucket')->redirect();
    }

    /**
     * @return RedirectResponse
     */
    public function callbackBitbucket()
    {
        try {
            $user = Socialite::driver('bitbucket')->user();

            if ($user) {
                /*
                 * Store bitbucket account, pages, ad account and other information if it does not exist
                 * */
                $this->bitbucketAutomationRepository->setupBitbucketAccount($user->token, $user->expiresIn, $user->id, $user->email, $user->avatar, $user->name, $user->refreshToken);

                Auth::user()->is_ds_bitbucket_tracking_enabled = true;
                Auth::user()->save();
                return redirect()->to('data-source?show_bit_bucket_popup=1')->with('Account connected. You can enable the automation now.');

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
    public function userBitbucketAccountsExists(Request $request): JsonResponse
    {
        return $this->bitbucketAutomationRepository->userBitbucketAccountsExists();
    }

    public function getWorkspaces()
    {
        return $this->bitbucketAutomationRepository->getWorkspaces();
    }

}
