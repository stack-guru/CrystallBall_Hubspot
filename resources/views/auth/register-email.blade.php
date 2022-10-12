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
    <input type="text" id="inputName" class="form-control @error('name') is-invalid @enderror" placeholder="Full Name"
      required="" autofocus="" name="name" value="{{ old('name') }}">
    <label for="inputName">Full Name</label>
    @error('name')
    <span class="invalid-feedback" role="alert">
      <strong>{{ $message }}</strong>
    </span>
    @enderror
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
    <div class="form-check">
      <input type="checkbox" class="form-check-input @error('read_confirmation') is-invalid @enderror"
        name="read_confirmation" id="read_confirmation" />
      <label class="form-check-label" for="read_confirmation">Do you agree to our <a href="https://crystalballinsight.com/privacy-policy" target="_blank">Privacy Policy</a>?</label>
      @error('read_confirmation')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
    </div>
  </div>

  <div class="form-label-group" style="padding-left: 12%;">
      @error('g-recaptcha-response')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
      <div class="g-recaptcha" data-sitekey="{{config('services.recaptcha.client.key')}}" data-callback="gRecaptchaSuccessCallBack" data-expired-callback="gRecaptchaExpireCallBack"></div>
  </div>

  <button class="btn btn-lg btn-primary btn-block" type="submit" id="registerButton" disabled>Register</button>
  {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a> --}}
  <a class="minified-provider mt-3" href="{{ route('socialite.google') }}"><img class="oauth-logo" src="/images/google-logo.png"><span class="minified-provider-name">Sign up with Google</span></a>
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
