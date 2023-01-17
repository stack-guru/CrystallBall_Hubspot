<!DOCTYPE html>
<html lang="en">

<head>

  @include('helpers/trackingCodesHeader')

  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="@yield('meta-description')">
  <meta name="author" content="">

  <link rel="shortcut icon" type="image/ico" href="{{config('app.icon')}}" />
  <title>@yield('page-title')</title>

  {{--
  <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/floating-labels/"> --}}

  <!-- Bootstrap core CSS -->
  <link href="{{asset('css/auth.css')}}" rel="stylesheet">

  <!-- Custom styles for this template -->
  {{--
  <link href="{{asset('css/floating-labels.css')}}" rel="stylesheet"> --}}
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>

<body>
  @include('helpers/trackingCodesBody')
  <div class="auth-wrapper">
    <header id='auth-header' class="auth-header">
      <div class="container d-flex justify-content-between align-items-center">
        <strong><a class="d-block" href="/"><img src="/logo-new.svg" width="150" height="44" alt="Crystal Ball"></a></strong>
        <ul class='auth-nav'>
          <li><a href=''>Pricing</a></li>
          <li><a href=''>Login</a></li>
          <li><a class='btn-theme' href=''>Sign up</a></li>
        </ul>
      </div>
    </header>
    <main class='auth-main'>
      @yield('content')
    </main>
  </div>
  @yield('javascript')
</body>
</html>