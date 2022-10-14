@component('mail::message')

<p>Welcome {{ $user->name }}!</p>
<p>
    Please verify your email address to complete the account setup.
</p>

@component('mail::button', ['url' => $verificationLink])
Verify Email Address
@endcomponent

<p>
    Your verification link will expire in {{ config('auth.verification.expire',5) }} minutes.
</p>

Thank you,<br />
{{ config('app.name') }}<br />
{{-- <hr />
<p>
    If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:
    <a href="{{ $verificationLink }}">{{ $verificationLink }}</a>
</p> --}}
@endcomponent
