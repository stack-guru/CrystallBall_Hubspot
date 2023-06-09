<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    @include('helpers/trackingCodesHeader')

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="shortcut icon" type="image/ico" href="{{config('app.icon')}}" />
    <title>@yield('page-title')</title>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    {{-- <script src="{{ asset('js/admin.js') }}" defer></script> --}}
    {{-- <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script> --}}
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
    

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    @yield('css')
    <!-- Styles -->
    {{-- <link href="{{ asset('css/admin.css') }}" rel="stylesheet"> --}}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <script>
        jquery(function () {
            jquery('[data-toggle="tooltip"]').tooltip()
        });
    </script>
</head>

<body>
    @include('helpers/trackingCodesBody')
    <div id="app">
        
        <nav class="navbar navbar-expand-lg navbar-light bg-light text-sm sticky-top ">
            <div class="">
                <div class="my-1 text-secondary mx-2 mb-2"><small>Page rendered on : {{ \Illuminate\Support\Carbon::now() }}</small></div>
                <!-- <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a> -->
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    
                    <ul class="navbar-nav mr-auto">
                        @guest
                        @else
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.dashboard') }}">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.price-plan.index') }}">Price Plans</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('admin.cookie-coupon.index')}}">Cookie Coupons</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('admin.coupon.index')}}">Coupons</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('admin.registration-offer.index')}}">Registration Offers</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('admin.checklist-item.index')}}">Checklist Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.user.index') }}">Users</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.spectator.index') }}">Spectators</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.web-monitor.index') }}">Web Monitors</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.data-source.index') }}">Data Source</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.price-plan-subscription.index') }}">Payment History</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.payment-detail.index') }}">Payment Details</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.auto-payment-log.index') }}">Payment Log</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.plan-notifications.index') }}">Plan Notification</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('admin.reports.user-active-report.show') }}">Active User Report</a>
                        </li>
                        @endguest
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                        </li>
                        @if (Route::has('register'))
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                        </li>
                        @endif
                        @else
                        <li class="nav-item dropdown">
                            <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                 document.getElementById('logout-form').submit();">
                                {{ __('Logout') }}
                            </a>
                        </li>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            <div class="col-sm-12">
                @include('helpers/messages')
                @yield('content')
            </div>
        </main>
    </div>
    @yield('js')
</body>

</html>
