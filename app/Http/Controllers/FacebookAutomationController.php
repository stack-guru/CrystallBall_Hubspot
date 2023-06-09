<?php

namespace App\Http\Controllers;

use App\Helper\Helper;
use App\Models\UserFacebookAccount;
use App\Models\FacebookTrackingConfiguration;
use App\Models\FacebookTrackingAnnotation;
use App\Models\UserFacebookPage;
use App\Models\UserFacebookPagePost;
use App\Repositories\FacebookAutomationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

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
        $facebookAccountPages = $facebookAccount->pages;
        $configurations = FacebookTrackingConfiguration::where('user_id', Auth::user()->id)->get();

        foreach($facebookAccountPages as $faPage) {
            foreach($configurations as $configuration) {
                $selectedPages = unserialize($configuration->selected_pages);
                foreach($selectedPages as $selectedPage) {
                    if($selectedPage['value'] == $faPage->id) {
                        FacebookTrackingAnnotation::where('configuration_id', $configuration->id)->delete();
                        $configuration->delete();
                    }
                }
            }
            foreach($faPage->posts as $post) {
                UserFacebookPagePost::where('id', $post->id)->delete();
            }
            UserFacebookPage::where('id', $faPage->id)->delete();
        }
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

            if ($user){
                
                /*
                * Store facebook account, pages, ad account and other information if it does not exist
                * */
                $this->facebookAutomationRepository->setupFacebookAccount($user->token, $user->expiresIn, $user->id, $user->email, $user->avatar, $user->name);
                
                /*
                * Store instagram account, pages, ad account and other information if it does not exist
                * */
                (new InstagramAccountController())->setupInstagramAccount($user->token);
                
                
                return redirect()->to("/data-source?show_facebook_popup=1&alertMessage=Account connected. You can enable the automation now.");

            }
            else{
                return redirect()->to('data-source')->with('Account not connected.');
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
