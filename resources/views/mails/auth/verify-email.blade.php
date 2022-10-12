@component('mail::message')
# Welcome {{ $user->name }}!

Please verify your email address using the code below to complete account setup!

@component('mail::button', ['url' => $verificationLink])
Verify Email Address
@endcomponent

@component('mail::panel')
Your Verification link will expire in {{ config('auth.verification.expire',5) }} minutes, so make sure you use it as soon as you can.
@endcomponent


Thank you,<br />
{{ config('app.name') }}<br />
<hr />
<p>
    If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:
    <a href="{{ $verificationLink }}">{{ $verificationLink }}</a>
</p>
@endcomponent
