@component('mail::message')

<p>Hi {{ $admin->name }},</p>
<p>
    {{ $user->email }} wants to use Crystal Ball (GAannotations) as a part of your team. You can add team members <a href="{{ $addMemberLink }}">HERE</a>
</p>

<br/>

Need help? Contact us for support.
<br />
<br />
The Crystal Ball Team.<br />
<hr />
@endcomponent
