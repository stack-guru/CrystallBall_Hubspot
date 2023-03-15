@component('mail::message')

<p>Contact Email:</p>
<br/>
<p>Hi {{ $admin->name }},</p>
<p>
    {{ $user->email }} wants to use Crystal Ball as a part of your team. You can add team members <a href="{{ $addMemberLink }}">HERE</a>
</p>

<br/>
<br/>
<br/>

Contact us for support.<br />
The Crystal Ball Team.<br />
<hr />
@endcomponent
