<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>New User</title>

  <!-- Fonts -->
  <link rel="dns-prefetch" href="//fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

  <!-- Styles -->
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>

  <div id="app">
    <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <div class="container my-3 text-center">
        <a class="navbar-brand" href="{{ url('/') }}">
          {{ config('app.name', 'Laravel') }}
        </a>
      </div>
    </nav>

    <main class="py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">New User Registered</div>

              <div class="card-body">
                <h3>Hi, {{ $admin->name }}!</h3>
                <p>A new user of name {{ $user->name }} and email {{ $user->email }} has just signed up.</p>
                <p>Please login to your dashboard for more details.</p>

                <div>
                  <h4>Verification:</h4>
                  <div>
                    @if ($user->email_verified_at)
                      <span class="badge badge-primary">Email verified at {{ $user->email_verified_at->format('Y-m-d') }}</span>
                    @else
                      <span class="badge badge-danger">Email not verified</span>
                    @endif

                    @if ($user->password != \App\Models\User::EMPTY_PASSWORD)
                      <span class="badge badge-success">Password has been set</span>
                    @else
                      <span class="badge badge-danger">Password not set</span>
                    @endif

                    @if ($user->phone_verified_at)
                        <span class="badge badge-primary">Phone number verified at {{ $user->phone_verified_at->format('Y-m-d') }}</span>
                    @else
                        <span class="badge badge-danger">Phone not verified</span>
                    @endif
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>

</html>
