<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Spectator;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Models\Annotation' => 'App\Policies\AnnotationPolicy',
        'App\Models\User' => 'App\Policies\UserPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Passport::routes();

        Auth::viaRequest('admin', function ($request) {
            return Admin::where('token', $request->token)->first();
        });

        Auth::viaRequest('spectator', function ($request) {
            return Spectator::where('token', $request->token)->first();
        });
    }
}
