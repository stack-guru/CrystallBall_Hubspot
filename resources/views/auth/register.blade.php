@extends('layouts/auth')

@section('page-title', 'Register')

@section('content')
    <form class="form-signin"method="POST" action="{{ route('register') }}" onsubmit="registerFormSubmit">
        @csrf
      <div class="text-center mb-4">
        <img class="mb-4" src="{{asset('images/company_logo.png')}}" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">GAannotations</h1>
{{--        <p>Google Analytics Annotations Amplified</p>--}}
      </div>

      <div class="form-label-group">
        <input type="name" id="inputName" class="form-control @error('name') is-invalid @enderror" placeholder="Full Name" required="" autofocus="" name="name" value="{{ old('name') }}">
        <label for="inputName">Full Name</label>
        @error('name')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>

      <div class="form-label-group">
        <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
        <label for="inputEmail">Email address</label>
        @error('email')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>

      <div class="form-label-group">
        <input type="password" id="inputPassword" class="form-control @error('email') is-invalid @enderror" placeholder="Password" required="" name="password" value="{{ old('password') }}">
        <label for="inputPassword">Password</label>
        @error('email')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>

      <div class="form-label-group">
        <input type="password" id="inputPasswordConfirmation" class="form-control @error('password_confirmation') is-invalid @enderror" placeholder="Password Confirmation" required="" name="password_confirmation" value="{{ old('password_confirmation') }}">
        <label for="inputPasswordConfirmation">Password Confirmation</label>
        @error('password_confirmation')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>
        <div className="form-check mt-3">
            <input type="checkbox" className="form-check-input" name="read_confirmation"
                   id="read_confirmation" />
            <label className="form-check-label" htmlFor="read_confirmation">
                By clicking register you agree to our <a href="https://gaannotations.com/privacy-policy">Privacy Policy</a> </label>
        </div>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
      <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a>
    </form>
<script>
  function registerFormSubmit(e){

    fbq('track', 'CompleteRegistration');
    gtag('event', 'conversion', {'send_to': 'AW-645973826/wQD3CJnzvugBEMKOg7QC'});
    ga('send', {
      hitType: 'event',
      eventCategory: 'SignUp',
      eventAction: 'SignUp',
      eventLabel: 'SignUp'
    });

  }
</script>
@endsection
