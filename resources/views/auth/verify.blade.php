@extends('layouts/auth')

@section('page-title', 'Verify Email')
@section('meta-description', 'Verify Email to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')

  <form class="form-signin" method="POST" action="{{ route('generate-password') }}">
    @csrf
    <div class="text-center mb-4">
      <img class="mb-4" src="{{ config('app.logo') }}" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">{{ config('app.name') }}</h1>
      @if ($verified)
      <p>Set your password</p>
      @else
      <p>Confirm your email address</p>
      @endif
    </div>

    @if (session('resent'))
      <div class="alert alert-success" role="alert">
        {{ __('A fresh verification link has been sent to your email address.') }}
      </div>
    @endif

    @if (session('verified'))
      <div class="alert alert-success" role="alert">
        {{ __('Your email address has been verified successfully.') }}
      </div>
    @endif

    @if ($verified)
      <div class="form-label-group">
        <input type="password" id="inputPassword" class="form-control @error('password') is-invalid @enderror" placeholder="Password" required="" name="password" value="">
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
        <input type="password" id="inputPasswordConfirmation" class="form-control" placeholder="Password Confirmation" required="" name="password_confirmation" value="">
        <label for="inputPasswordConfirmation">Password Confirmation</label>
      </div>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
    @endif

    <p class="mt-4">
      {{ __('If you did not receive the email') }},
      <a href="#" onclick="event.preventDefault();document.getElementById('verification-resend-form').submit();">{{ __('Click here to request another verification link') }}</a>.
    </p>
  </form>

  <form class="d-none" method="POST" action="{{ route('verification.resend') }}" id="verification-resend-form">
    @csrf
  </form>
@endsection
