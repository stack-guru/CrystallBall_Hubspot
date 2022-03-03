@extends('layouts/auth')

@section('page-title', 'Register')
@section('meta-description', 'Signup to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
<form class="form-signin" method="POST" action="{{ route('register') }}">
  @csrf
  <div class="text-center mb-4">
    <img class="mb-4" src="{{ config('app.logo') }}" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">{{config('app.name')}}</h1>
    {{--        <p>Google Analytics Annotations Amplified</p>--}}
  </div>

  <div class="form-label-group">
    <a class="minified-provider mt-3" href="{{ route('socialite.google') }}"><img class="oauth-logo" src="/images/google-logo.png"><span class="minified-provider-name">Sign up with Google</span></a>
  </div>

  <p class="mt-2"><a href="{{ route('register', ['email' => true]) }}">Register</a> with Company Email</p>
  {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a> --}}
  <p class="mt-2">Already have an account? <a href="{{ route('login') }}">Login</a></p>
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