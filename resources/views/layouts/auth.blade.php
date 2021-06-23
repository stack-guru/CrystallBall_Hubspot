<!DOCTYPE html>
<html lang="en">

<head>

  @include('helpers/trackingCodes')

  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="@yield('meta-description')">
  <meta name="author" content="">

  <title>@yield('page-title') | GAannotations</title>

  {{--
  <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/floating-labels/"> --}}

  <!-- Bootstrap core CSS -->
  <link href="{{asset('css/auth.css')}}" rel="stylesheet">

  <!-- Custom styles for this template -->
  {{--
  <link href="{{asset('css/floating-labels.css')}}" rel="stylesheet"> --}}
</head>

<body>
  @yield('content')
</body>

</html>