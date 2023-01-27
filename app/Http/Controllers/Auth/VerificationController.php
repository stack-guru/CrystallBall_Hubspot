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
                    : redirect()->to(url('success_message'));
        }
        $userEmail = $user->email;                   //after email verified , when generate password  call wappalyzer api.
        $companyDomain = explode("@", $userEmail)[1];
        (new \App\Services\WappalyzerService())->getData($companyDomain,$user->name);
        event(new \Illuminate\Auth\Events\Registered($user));

        if ($request->user()->markEmailAsVerified()) {    
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
            return redirect()->to(url('success_message'));
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
