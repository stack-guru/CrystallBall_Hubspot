@extends('layouts/auth')

@section('page-title', 'Register')

@section('content')
<form class="form-signin" method="POST" action="{{ route('register') }}">
  @csrf
  <div class="text-center mb-4">
    <img class="mb-4" src="{{asset('images/company_logo.png')}}" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">GAannotations</h1>
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
    <input type="password" id="inputPassword" class="form-control @error('password') is-invalid @enderror"
      placeholder="Password" required="" name="password" value="">
    <label for="inputPassword">Password</label>
    @error('password')
      @foreach ($errors->get('password') as $message)
        <span class="invalid-feedback" role="alert">
          <strong>{{ $message }}</strong>
        </span>
      @endforeach
    @enderror
  </div>

  <div class="form-label-group">
    <input type="password" id="inputPasswordConfirmation"
      class="form-control" placeholder="Password Confirmation"
      required="" name="password_confirmation" value="">
    <label for="inputPasswordConfirmation">Password Confirmation</label>
  </div>

  <div class="form-label-group">
    <div class="form-check">
      <input type="checkbox" class="form-check-input @error('read_confirmation') is-invalid @enderror"
        name="read_confirmation" id="read_confirmation" />
      <label class="form-check-label" for="read_confirmation">Do you agree to our <a href="https://gaannotations.com/privacy-policy" target="_blank">Privacy Policy</a>?</label>
      @error('read_confirmation')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
    </div>
  </div>

  <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
  <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a>
</form>
@endsection