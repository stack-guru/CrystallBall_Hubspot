<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationMail;
use App\Models\CompanyInfo;
use App\Models\User;
use App\Models\websiteTechnologyLookup;
use App\Providers\RouteServiceProvider;
use App\Traits\VerifiesPhones;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
     */

    use VerifiesEmails, VerifiesPhones;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except('verify');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend', 'verifyPhone', 'resendPhone');
    }


    /**
     * Show the email verification notice.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function show(Request $request)
    {
        $verified = $request->user()->hasVerifiedEmail();
        return $verified 
        // && ($request->user()->password != User::EMPTY_PASSWORD || ($request->user()->password === User::EMPTY_PASSWORD && $request->user()->has_password == false))
                        ? redirect()->to(url('success_message'))
                        // ? redirect($this->redirectPath())
                        : view('auth.verify', compact('verified'));
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        Auth::login($user);

        if (! hash_equals((string) $request->route('id'), (string) $request->user()->getKey())) {
            throw new AuthorizationException;
        }

        if (! hash_equals((string) $request->route('hash'), sha1($request->user()->getEmailForVerification()))) {
            throw new AuthorizationException;
        }

        if ($request->user()->hasVerifiedEmail()) {
            return $request->wantsJson()
                        ? new JsonResponse([], 204)
                        : redirect($this->redirectPath());
        }

        if ($request->user()->markEmailAsVerified()) {    
            $userEmail = $user->email;                                  //after email verified , when generate password  call wappalyzer api.
            $companyDomain = explode("@", $userEmail)[1];
            
            $ch = curl_init();
            curl_setopt_array($ch, array(
                CURLOPT_URL => 'https://api.wappalyzer.com/v2/lookup/?sets=all&recursive=false&urls=https://www.' . $companyDomain . '&live=true',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                'x-api-key: UX3cAmxgPY8MhOMAhPtac6EjuoKeEmlH89SYpxD4'    //wappalyzer api key for our companyEmail
                ),
            ));
            
            $response = curl_exec($ch);
            curl_close($ch);
            $data = json_decode($response);

            $companyInfo = new CompanyInfo();
            $companyInfo -> user_name = $user->name;
            $companyInfo -> company_name = $data[0]->companyName;
            $companyInfo -> company_size = $data[0]->companySize;
            $companyInfo -> industry = $data[0]->industry;
            $companyInfo -> language = $data[0]->language;
            $companyInfo -> ip = @$data[0]->ipCountry;
            $companyInfo -> location = empty($data[0]->locations[0]) ? null : $data[0]->locations[0];
            $companyInfo -> facebook = empty($data[0]->facebook[0]) ? null : $data[0]->facebook[0];
            $companyInfo -> twitter = empty($data[0]->twitter[0]) ? null : $data[0]->twitter[0];
            $companyInfo -> linkedin = empty($data[0]->linkedin[0]) ? null : $data[0]->linkedin[0];
            $companyInfo -> instagram = empty($data[0]->instagram[0]) ? null : $data[0]->instagram[0];
            
            $companyInfo -> save();                                         //save company info

            $websiteTechLookup = new websiteTechnologyLookup();
            $techArray = $data[0]-> technologies;
            $websiteTechLookup -> site_url = $data[0]->url;
            $websiteTechLookup -> tech1 = empty($techArray[0]->name) ? null : $techArray[0]->name;
            $websiteTechLookup -> tech2 = empty($techArray[1]->name) ? null : $techArray[1]->name;
            $websiteTechLookup -> tech3 = empty($techArray[2]->name) ? null : $techArray[2]->name;
            $websiteTechLookup -> tech4 = empty($techArray[3]->name) ? null : $techArray[3]->name;
            $websiteTechLookup -> tech5 = empty($techArray[4]->name) ? null : $techArray[4]->name;
            $websiteTechLookup -> tech6 = empty($techArray[5]->name) ? null : $techArray[5]->name;
            $websiteTechLookup -> tech7 = empty($techArray[6]->name) ? null : $techArray[6]->name;
            $websiteTechLookup -> tech8 = empty($techArray[7]->name) ? null : $techArray[7]->name;
            $websiteTechLookup -> tech9 = empty($techArray[8]->name) ? null : $techArray[8]->name;
            $websiteTechLookup -> tech10 = empty($techArray[9]->name) ? null : $techArray[9]->name;
            $websiteTechLookup -> tech11 = empty($techArray[10]->name) ? null : $techArray[10]->name;
            $websiteTechLookup -> tech12 = empty($techArray[11]->name) ? null : $techArray[11]->name;
            $websiteTechLookup -> tech13 = empty($techArray[12]->name) ? null : $techArray[12]->name;
            $websiteTechLookup -> tech14 = empty($techArray[13]->name) ? null : $techArray[13]->name;
            $websiteTechLookup -> tech15 = empty($techArray[14]->name) ? null : $techArray[14]->name;
            $websiteTechLookup -> tech16 = empty($techArray[15]->name) ? null : $techArray[15]->name;
            $websiteTechLookup -> tech17 = empty($techArray[16]->name) ? null : $techArray[16]->name;
            $websiteTechLookup -> tech18 = empty($techArray[17]->name) ? null : $techArray[17]->name;
            $websiteTechLookup -> tech19 = empty($techArray[18]->name) ? null : $techArray[18]->name;
            $websiteTechLookup -> tech20 = empty($techArray[19]->name) ? null : $techArray[19]->name;
            $websiteTechLookup -> save();                                       //save tech lookup (must improve later.)
            event(new \Illuminate\Auth\Events\Registered($user));
            event(new Verified($request->user()));
        }
        if ($response = $this->verified($request)) {
            return $response;
        }
        return $request->wantsJson()
                    ? new JsonResponse([], 204)
                    : redirect()->to(url('success_message'));
                    // ->with('verified', true);Path())
                    // ->with('verified', true);
    }

    /**
     * The user has been verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    protected function verified(Request $request)
    {
        // if($request->user()->password === User::EMPTY_PASSWORD && $request->user()->has_password == true){
            return redirect()->route('verification.notice')->with('verified',true);
        // }
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect($this->redirectPath());
        }

        Mail::to($request->user()->email)->send(new EmailVerificationMail($request->user()));

        return $request->wantsJson()
        ? new JsonResponse([], 202)
        : back()->with('resent', true);
    }
}
