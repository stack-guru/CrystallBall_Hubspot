@extends('layouts/auth')

@section('page-title', 'Login')
@section('meta-description', 'Sign in to ' . config('app.name'))

@section('content')

    <form class="form-signin" method="POST" action="{{ route('login') }}">
        @csrf
        <!-- <div class="text-center mb-4">
            {{-- <img class="mb-1" src="{{ config('app.logo') }}" alt="" width="72" height="72"> --}}
        <img class="mb-1" src="{{ asset('images/company_logo_cbi_login.png') }}" alt="" width="72" height="72">
            <h1 class="h3 mb-3 font-weight-normal">{{ config('app.name') }}</h1>
            {{-- <p>Google Analytics Annotations Amplified</p> --}}
        </div> -->
        <h2>Login</h2>

        <div class="themeNewInputStyle mb-3">
            <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror"
                   placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
            @error('email')
            <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="themeNewInputStyle mb-3">
            <input type="password" id="inputPassword" class="form-control @error('password') is-invalid @enderror"
                   placeholder="Password" required="" name="password" value="{{ old('password') }}">
            @error('password')
            <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="py-2 mb-3 d-flex justify-content-between">
            <label for='1' class='d-flex align-items justify-content-end serviceCheckBox m-0'>
                <input id='1' name="remember" type="checkbox"
                       value="remember-me" {{ old('remember') ? 'checked' : '' }}>
                <span>Remember me</span>
            </label>
            <a href="{{ route('password.request') }}">Forgot password?</a>
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
        <div class="mb-3">
            <button class="btn-theme" type="submit">Login</button>
        </div>
        <div class="or text-center mb-3">
            <span>or</span>
        </div>
        <div>
            <a class="btn-google minified-provider" href="{{ route('socialite.google') }}">
                <img class="oauth-logo" src="/images/google-logo.png" alt="google logo">
                <span class="minified-provider-name">Sign in with Google</span>
            </a>
        </div>
        {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('register') }}">Register</a> --}}
        <p>Don’t have an account? <a href="{{ route('register') }}?email=1">Sign up</a></p>
    </form>

    <script>
        localStorage.removeItem('frontend_redirect_to');
    </script>
@endsection
