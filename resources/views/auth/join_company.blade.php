@extends('layouts/auth')

@section('page-title', 'Join Company')
@section('meta-description', 'Join Company to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
    <!-- Uh, oh... screen Code -->
    <div class="container d-flex justify-content-center">
        <div class="confirmationContent d-flex flex-column text-center">
            <h1>Join your company account...</h1>
            <p>It appears that your company already has an active account, Request an invitation to join the account
                now.</p>
            <em>Or</em>
            <a href="{{url('register?email=1')}}">
                <button class='btn-theme-outline'>Create a new Workspace</button>
            </a>
            <hr/>
            <span class='goback'>Incorrect email? <a href='{{url('register?email=1')}}'
                >Go back</a></span>
        </div>
    </div>
@endsection
