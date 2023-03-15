@extends('layouts/auth')

@section('page-title', 'Welcome')
@section('meta-description', 'Welcome to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
    <!-- Success! screen Code -->
    <div class="container d-flex justify-content-center">
        <div class="confirmationContent success d-flex flex-column text-center">
            <figure><img src='./icon-confirmation-email.svg'/></figure>
            <h1>Success!</h1>
            <p>.Your request to join is sent to the admin.
                <a href='https://www.crystalball.pro/'>Contact Us</a> if you have any query.</p>
        </div>
    </div>
@endsection
