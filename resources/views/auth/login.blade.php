<!DOCTYPE html>
<html lang="en"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Login | GAnnotations</title>

    {{-- <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/floating-labels/"> --}}

    <!-- Bootstrap core CSS -->
    <link href="{{asset('css/login.css')}}" rel="stylesheet">

    <!-- Custom styles for this template -->
    {{-- <link href="{{asset('css/floating-labels.css')}}" rel="stylesheet"> --}}
  </head>

  <body>
    <form class="form-signin"method="POST" action="{{ route('login') }}">
        @csrf
      <div class="text-center mb-4">
        <img class="mb-4" src="{{asset('images/company_logo.png')}}" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">GAnnotations</h1>
        <p>Google Analytics Annotations Amplified - Automate your Google Analytics annotations and add the missing pieces to the puzzle uploading bulk annotations via API or CSV.</p>
      </div>

      <div class="form-label-group">
        <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
        <label for="inputEmail">Email address</label>
        @error('email')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>

      <div class="form-label-group">
        <input type="password" id="inputPassword" class="form-control @error('email') is-invalid @enderror" placeholder="Password" required="" name="password" value="{{ old('password') }}">
        <label for="inputPassword">Password</label>
        @error('email')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
      </div>

      <div class="checkbox mb-3">
        <label>
          <input name="remember" type="checkbox" value="remember-me" {{ old('remember') ? 'checked' : '' }}> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted text-center">© 2017-2018</p>
    </form>
  

</body></html>