@extends('layouts/auth')

@section('page-title', 'Join Company')
@section('meta-description', 'Join Company to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
    <!-- Uh, oh... screen Code -->
    <div class="container d-flex justify-content-center">
        <div class="confirmationContent d-flex flex-column text-center">
            <h1>Uh, oh...</h1>
            <p>
                It appears that your company already has an active account,
                <a onclick="event.preventDefault();sendInvitation();" href='#'>
                    Request an invitation
                </a>
                to join the account now.
            </p>
            <em>Or</em>
            <a href="{{url('register?email=1')}}">
                <button class='btn-theme-outline'>Create a new Workspace</button>
            </a>
            <hr/>
            <span class='goback'>Incorrect email? <a href='{{url('register?email=1')}}'
                >Go back</a></span>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script>
    <script type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>

    <script>
        function sendInvitation() {
            const inviteURL = "{{ route('request.invite') }}";

            $.ajax(inviteURL, {
                type: 'POST',
                data: {email: "{{ request('email') }}"},
                dataType: 'JSON',
                cache: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (data) {
                    alert(data.success);
                }
            });

        }
    </script>
@endsection


@section('scripts')

@endsection
