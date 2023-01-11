@extends('layouts/auth')

@section('page-title', 'Login')
@section('meta-description', 'Sign in to ' . config('app.name'))

@section('content')

    <form class="form-signin" method="POST" action="{{ route('login') }}">
        @csrf
        <div class="text-center mb-4">
            {{-- <img class="mb-1" src="{{ config('app.logo') }}" alt="" width="72" height="72"> --}}
            <img class="mb-1" src="{{ asset('images/company_logo_cbi_login.png') }}" alt="" width="72" height="72">
            <h1 class="h3 mb-3 font-weight-normal">{{ config('app.name') }}</h1>
            {{-- <p>Google Analytics Annotations Amplified</p> --}}
        </div>

        <div class="form-label-group">
            <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror"
                placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
            <label for="inputEmail">Email address</label>
            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-label-group">
            <input type="password" id="inputPassword" class="form-control @error('password') is-invalid @enderror"
                placeholder="Password" required="" name="password" value="{{ old('password') }}">
            <label for="inputPassword">Password</label>
            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="checkbox mb-3">
            <label>
                <input name="remember" type="checkbox" value="remember-me" {{ old('remember') ? 'checked' : '' }}>
                Remember me
            </label>
        </div>
        @if (\Session::has('message'))
            <div class="my-3 mb-3 text-left">
                <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <div class="ml-2">
                        {!! \Session::get('message') !!}
                    </div>
                </div>
            </div>
        @endif
        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
        {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('register') }}">Register</a> --}}
        <a class="minified-provider mt-3" href="{{ route('socialite.google') }}"><img class="oauth-logo"
                src="/images/google-logo.png" alt="google logo"><span class="minified-provider-name">Sign in with Google</span></a>
        <p class="mt-2"><a href="{{ route('password.request') }}">Forgot password?</a></p>
        <p class="mt-2">Don't have an account? <a href="{{ route('register') }}">Register</a></p>
    </form>
@endsection
