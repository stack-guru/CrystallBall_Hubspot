@extends('layouts/auth')

@section('page-title', 'Configure Account')
@section('meta-description', 'Configure your account for ' . config('app.name'))

@section('content')
<form class="form-signin" method="POST" action="{{ route('app-sumo.password.update', ['identification-code' => request()->query('identification-code') ]) }}">
    @csrf
    @method('PUT')
    <div class="text-center mb-4">
        <img class="mb-1" src="{{ config('app.logo') }}" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Configure your {{config('app.name')}} Account</h1>
        {{-- <p>Google Analytics Annotations Amplified</p>--}}
    </div>

    <div class="form-label-group">
        <input type="name" id="inputName" class="form-control @error('name') is-invalid @enderror" placeholder="Sumo-ling" required="" autofocus="" name="name" value="{{ old('name') }}">
        <label for="inputName">Name</label>
        @error('name')
        <span class="invalid-feedback" role="alert">
            <strong>{{ $message }}</strong>
        </span>
        @enderror
    </div>

    <div class="form-label-group">
        <input type="password" id="inputPassword" class="form-control @error('password') is-invalid @enderror" placeholder="Password" required="" name="password" value="{{ old('password') }}">
        <label for="inputPassword">Password</label>
        @error('password')
        <span class="invalid-feedback" role="alert">
            <strong>{{ $message }}</strong>
        </span>
        @enderror
    </div>

    <div class="form-label-group">
        <input type="password" id="inputPasswordConfirmation" class="form-control @error('password_confirmation') is-invalid @enderror" placeholder="password_confirmation" required="" name="password_confirmation" value="{{ old('password_confirmation') }}">
        <label for="inputPasswordConfirmation">Password Confirmation</label>
        @error('password_confirmation')
        <span class="invalid-feedback" role="alert">
            <strong>{{ $message }}</strong>
        </span>
        @enderror
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Setup Account</button>
</form>
@endsection
