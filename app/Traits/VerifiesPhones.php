<?php

namespace App\Traits;

use App\Exceptions\ExpiredPhoneCodeException;
use App\Exceptions\InvalidPhoneCodeException;
// use Illuminate\Auth\Events\VerifiedPhone;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Auth\RedirectsUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait VerifiesPhones
{
    use RedirectsUsers;

    /**
     * Show the phone verification notice.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function showPhone(Request $request)
    {
        return $request->user()->hasVerifiedPhone()
        ? redirect($this->redirectPath())
        : view('auth.verify');
    }

    /**
     * Mark the authenticated user's phone address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function verifyPhone(Request $request)
    {
        if (Carbon::now() > Carbon::parse($request->user()->phone_verification_expiry)) {
            throw new ExpiredPhoneCodeException;
        }
        
        if (sha1($request->verification_code) !== $request->user()->phone_verification_code) {
            throw new InvalidPhoneCodeException;
        }

        if ($request->user()->hasVerifiedPhone()) {
            return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect($this->redirectPath());
        }

        if ($request->user()->markPhoneAsVerified()) {
            // event(new VerifiedPhone($request->user()));
        }

        if ($response = $this->verifiedPhone($request)) {
            return $response;
        }

        return $request->wantsJson()
        ? new JsonResponse([], 204)
        : redirect($this->redirectPath())->with('verified', true);
    }

    /**
     * The user has been verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    protected function verifiedPhone(Request $request)
    {
        //
    }

    /**
     * Resend the phone verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function resendPhone(Request $request)
    {
        if ($request->user()->hasVerifiedPhone()) {
            return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect($this->redirectPath());
        }

        $request->user()->sendPhoneVerificationNotification();

        return $request->wantsJson()
        ? new JsonResponse([], 202)
        : back()->with('resent', true);
    }
}
