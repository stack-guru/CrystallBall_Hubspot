@extends('layouts/auth')

@section('page-title', 'Reset Password')
@section('meta-description', 'Reset your password to ' . config('app.name'))

@section('content')
<form class="form-signin" method="POST" action="{{ route('password.email') }}">
    @csrf
    <div class="text-center mb-4">
      <h1 class="h3 mb-3 font-weight-normal">Reset Password</h1>
      {{--        <p>Google Analytics Annotations Amplified</p>--}}
    </div>
    @if (session('status'))
    <div class="alert alert-success" role="alert">
        {!! session('status') !!}
    </div>
    @endif
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
  
    <button class="btn btn-lg btn-primary btn-block" type="submit">Send Password Reset Link</button>
  </form>
@endsection
