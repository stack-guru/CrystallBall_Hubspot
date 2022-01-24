<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use League\OAuth2\Server\Exception\OAuthServerException;

class AppSumoAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        if ($request->hasHeader('authorization') === false) {
            throw OAuthServerException::accessDenied('Missing "Authorization" header');
        }

        $header = $request->getHeader('authorization');
        $token = \trim((string) \preg_replace('/^\s*Bearer\s/', '', $header[0]));

        if (!User::where('token', $token)->first()) {
            throw OAuthServerException::accessDenied('Access token could not be verified');
        }

        return $next($request);
    }
}
