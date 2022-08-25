<?php

namespace App\Http\Controllers;

use App\Helper\Helper;
use App\Models\UserFacebookAccount;
use App\Repositories\FacebookAutomationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class FacebookAutomationController extends Controller
{

    public $facebookAutomationRepository;

    public function __construct()
    {
        $this->facebookAutomationRepository = new FacebookAutomationRepository();
    }

    public function index()
    {
        return view('ui/app');

        $user = \auth()->user();
        $user_facebook_accounts = $user->facebook_accounts;

        return response()->json([
            'facebook_accounts' => $user_facebook_accounts,
        ]);
    }

    public function UIindex()
    {
        $user = \auth()->user();
        $user_facebook_accounts = $user->facebook_accounts;

        return response()->json([
            'facebook_accounts' => $user_facebook_accounts,
        ]);
    }


    public function destroy(UserFacebookAccount $facebookAccount)
    {
        return ['success' => $facebookAccount->delete()];
    }



    public function redirectFacebook()
    {
        return Socialite::driver('facebook')->scopes([
            'email',
            'read_insights',
            'pages_show_list',
            'pages_read_engagement',
            'public_profile',
            'instagram_basic',
            'pages_show_list',
            'instagram_manage_insights',
//            'ads_management',
//            'ads_read',
        ])->redirect();
    }

    /**
     * @return RedirectResponse
     */
    public function callbackFacebook()
    {
        try {
            $user = Socialite::driver('facebook')->user();
            dd($user);
            if ($user){
                /*
                 * Store facebook account, pages, ad account and other information if it does not exist
                 * */
                $this->facebookAutomationRepository->setupFacebookAccount($user->token, $user->expiresIn, $user->id, $user->email, $user->avatar, $user->name);
                return redirect()->to('data-source')->with('Facebook account connected.');
            }
            else{
                return redirect()->to('data-source')->with('Facebook account not connected.');
            }
        }catch (\Exception $exception){
            return redirect()->to('data-source')->with($exception->getMessage());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function userFacebookAccountsExists(Request $request): JsonResponse
    {
        return $this->facebookAutomationRepository->userFacebookAccountsExists();
    }

    public function facebookAdsWebhookGet(Request $request)
    {
        dd($request->all());
    }

}
