@extends('layouts/auth')

@section('page-title', 'Register')
@section('meta-description', 'Signup to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
<form class="form-signin" method="POST" action="{{ route('register') }}">
  @csrf
  <!-- <div class="text-center mb-4">
    <img class="mb-4" src="{{ config('app.logo') }}" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">{{config('app.name')}}</h1>
  </div> -->
  <h2>Get started for Free</h2>

  <div class="themeNewInputStyle mb-3">
    <input type="text" id="inputName" class="form-control @error('name') is-invalid @enderror" placeholder="Full Name" required="" autofocus="" name="name" value="{{ old('name') }}">
    @error('name')
    <span class="invalid-feedback" role="alert">
      <strong>{{ $message }}</strong>
    </span>
    @enderror
  </div>

  <div class="themeNewInputStyle mb-3">
    <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
    @error('email')
    <span class="invalid-feedback" role="alert">
      <strong>{{ $message }}</strong>
    </span>
    @enderror
  </div>

  <div class="py-2 mb-3 d-flex justify-content-center">
      <label class="d-flex align-items justify-content-end serviceCheckBox m-0" for="read_confirmation">
        <input type="checkbox" class="form-check-input @error('read_confirmation') is-invalid @enderror" name="read_confirmation" id="read_confirmation" />
        <span>By signing up, you agree to our <a href="https://crystalballinsight.com/privacy-policy" target="_blank">privacy policy</a></span>
      </label>
      @error('read_confirmation')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
  </div>

  <div class="form-label-group" style="padding-left: 12%;">
      @error('g-recaptcha-response')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
      <div class="g-recaptcha" data-sitekey="{{config('services.recaptcha.client.key')}}" data-callback="gRecaptchaSuccessCallBack" data-expired-callback="gRecaptchaExpireCallBack"></div>
  </div>

  <div class="mb-3"><button class="btn-theme" type="submit" id="registerButton" disabled>Register</button></div>

  <div class="or text-center mb-3">
    <span>or</span>
  </div>

  <div>
    <a class="btn-google minified-provider" href="{{ route('socialite.google') }}">
      <img class="oauth-logo" src="/images/google-logo.png" alt="google logo">
      <span class="minified-provider-name">Sign up with Google</span>
    </a>
  </div>

  {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a> --}}
  {{-- <p>Already have an account? <a href="{{ route('login') }}">Login</a></p> --}}

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
