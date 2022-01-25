<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;

class AllowOnlyNonEmptyPassword
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
        if (Auth::user()->password == User::EMPTY_PASSWORD && $request->route()->getName() !== RouteServiceProvider::CHANGE_PASSWORD_ROUTE) {
            if (!$request->expectsJson()) return redirect(route(RouteServiceProvider::CHANGE_PASSWORD_ROUTE, ['identification-code' => $request->query('identification-code')]));
            if ($request->expectsJson()) abort(400, 'You need to set password before taking any action.');
        }

        return $next($request);
    }
}
