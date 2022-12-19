@extends('layouts/auth')

@section('page-title', 'Register')
@section('meta-description', 'Signup to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
<form class="form-signin" method="POST" action="{{ route('register') }}">
  @csrf
  <div class="text-center mb-4">
    {{-- <img class="mb-4" src="{{ config('app.logo') }}" alt="" width="72" height="72"> --}}
    <img class="mb-1" src="{{ asset('images/company_logo_cbi_login.png') }}" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">{{config('app.name')}}</h1>
  </div>

  <div class="form-label-group mb-4 pb-4">
    <a class="minified-provider mt-3" href="{{ route('socialite.google') }}"><img class="oauth-logo" src="/images/google-logo.png"><span class="minified-provider-name">Sign up with Google</span></a>
  </div>
  <p class="mt-4 pt-4 text-center">OR <a href="{{ route('register', ['email' => true]) }}">Register</a> with Company Email</p>
  <p class="mt-2 text-center">Already have an account? <a href="{{ route('login') }}">Login</a></p>
  <p class="mt-2 text-center">Check out our <a href="https://www.gaannotations.com/pricing" target="_blank">Plans and Pricing</a></p>
</form>
@endsection

@section('javascript')
<script>
  function gRecaptchaSuccessCallBack(responseToken) {
    document.getElementById('registerButton').removeAttribute('disabled');
  }

  function gRecaptchaExpireCallBack() {
    document.getElementById('registerButton').setAttribute('disabled', true);
  }
</script>
@endsection