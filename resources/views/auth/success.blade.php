@extends('layouts/auth')

@section('page-title', 'Welome')
@section('meta-description', 'Welome to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
<!-- Success! screen Code -->
<div class="container d-flex justify-content-center">
    <div class="confirmationContent success d-flex flex-column text-center">
        <figure><img src='./icon-confirmation-email.svg'/></figure>
        <h1>Success!</h1>
        <p>We have sent the account holder an email with your request to join. <a href='https://www.crystalball.pro/'>Contact Us</a> if you have any query.</p>
    </div>
</div>
@endsection

@section('javascript')
    <script>
        setTimeout(() => {
            window.location.href = '/annotation';
        }, 5000);
    </script>
@endsection