@extends('layouts/auth')

@section('page-title', 'Reset Password')
@section('meta-description', 'Reset your password to ' . config('app.name'))

@section('content')
<form class="form-signin" method="POST" action="{{ route('password.email') }}">
    @csrf
      <h2>Reset Password</h2>
      {{--        <p>Google Analytics Annotations Amplified</p>--}}
    @if (session('status'))
    <div class="alert alert-success" role="alert">
        {!! session('status') !!}
    </div>
    @endif
    <div class="themeNewInputStyle mb-3">
      <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
      @error('email')
      <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
      </span>
      @enderror
    </div>
  
    <button class="btn-theme btn-reset" type="submit">Send Password Reset Link</button>
  </form>
@endsection
