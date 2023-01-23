@extends('layouts/auth')

@section('page-title', 'Verify Email')
@section('meta-description', 'Verify Email to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
    <div class="container d-flex justify-content-center">
        <div class="confirmationContent d-flex flex-column text-center">

            <form class="confirmationContent d-flex flex-column text-center" method="POST"
                action="{{ route('generate-password') }}">
                @csrf
                @if ($verified)
                    <h4>It's time to set your password</h4>
                @else
                    <figure><img src='/icon-confirmation-email.svg' /></figure>
                    <h1>Confirmation email sent!</h1>
                    <p>Click on the confirmation link to verify your email</p>
                @endif

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
                        <input type="password" id="inputPassword"
                            class="form-control @error('password') is-invalid @enderror" placeholder="Password"
                            required="" name="password" value="">
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
                        <input type="password" id="inputPasswordConfirmation" class="form-control"
                            placeholder="Password Confirmation" required="" name="password_confirmation" value="">
                        <label for="inputPasswordConfirmation">Password Confirmation</label>
                    </div>

                    <button class="btn btn-lg btn-primary btn-block" type="submit">All set, let's get started</button>
                @else
                    <span>Haven’t received the email yet? <a href='#'
                            onclick="event.preventDefault();document.getElementById('verification-resend-form').submit();">Resend</a></span>
                    <em>Or</em>
                    <span class='goback'>Incorrect email? <a href='#'
                            onclick="event.preventDefault();document.getElementById('logout-to-register-page').submit();">Go
                            back</a></span>
                @endif
            </form>

            <form class="d-none" method="POST" action="{{ route('verification.resend') }}" id="verification-resend-form">
                @csrf
            </form>
            <form class="d-none" method="POST" action="{{ route('logout-and-destroy') }}" id="logout-to-register-page">
                @csrf
            </form>
        </div>
    </div>
@endsection
