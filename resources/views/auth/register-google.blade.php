@extends('layouts/auth')

@section('page-title', 'Register')
@section('meta-description', 'Signup to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
<form class="form-signin" method="POST" action="{{ route('register') }}">
  @csrf
 <!--  <div class="text-center mb-4">
    {{-- <img class="mb-4" src="{{ config('app.logo') }}" alt="" width="72" height="72"> --}}
    <img class="mb-1" src="{{ asset('images/company_logo_cbi_login.png') }}" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">{{config('app.name')}}</h1>
  </div> -->
  <h2>Register</h2>

  <div class="mb-3">
    <a class="btn-google minified-provider" href="{{ route('socialite.google') }}">
      <img class="oauth-logo" src="/images/google-logo.png" alt="google logo">
      <span class="minified-provider-name">Sign up with Google</span>
    </a>
  </div>
  <div class="or text-center mb-3">
    <span>or</span>
  </div>
  <p class="text-center"><a href="{{ route('register', ['email' => true]) }}">Register</a> with Company Email</p>
  <p class="text-center">Already have an account? <a href="{{ route('login') }}">Login</a></p>
  <!-- <p class="text-center">Check out our <a href="https://www.gaannotations.com/pricing" target="_blank">Plans and Pricing</a></p> -->
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