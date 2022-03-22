<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventCache
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

        $response = $next($request);

        // Laravel's default Cache-Control header sets to no-cache,private
        $response->header('Cache-Control', 'no-store');

        return $response;
    }
}
