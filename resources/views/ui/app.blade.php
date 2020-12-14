<!doctype html>
<html>
<head>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

        })(window,document,'script','dataLayer','GTM-TG8CBT8');</script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
{{--    <title>Dashboard</title>--}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        #loader {
            transition: all .3s ease-in-out;
            opacity: 1;
            visibility: visible;
            position: fixed;
            height: 100vh;
            width: 100%;
            background: #fff;
            z-index: 90000
        }

        #loader.fadeOut {
            opacity: 0;
            visibility: hidden
        }

        .spinner {
            width: 40px;
            height: 40px;
            position: absolute;
            top: calc(50% - 20px);
            left: calc(50% - 20px);
            background-color: #333;
            border-radius: 100%;
            -webkit-animation: sk-scaleout 1s infinite ease-in-out;
            animation: sk-scaleout 1s infinite ease-in-out
        }

        @-webkit-keyframes sk-scaleout {
            0% {
                -webkit-transform: scale(0)
            }
            100% {
                -webkit-transform: scale(1);
                opacity: 0
            }
        }

        @keyframes sk-scaleout {
            0% {
                -webkit-transform: scale(0);
                transform: scale(0)
            }
            100% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 0
            }
        }
        @font-face {
            font-family: themify;
            src: url(/a1ecc3b826d01251edddf29c3e4e1e97.woff);
        }
        @font-face {
            font-family: themify;
            src: url(/af7ae505a9eed503f8b8e6982036873e.woff2);
        }
        @font-face {
            font-family: themify;
            src: url(/fee66e712a8a08eef5805a46892932ad.woff);
        }
        @font-face {
            font-family: themify;
            src: url(/b06871f281fee6b241d60582ae9369b9.ttf);
        }
        </style>

    <link href="{{asset('style.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body class="app">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TG8CBT8" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div id="loader">
    <div class="spinner"></div>
</div>
<script>window.addEventListener('load', function load() {
        const loader = document.getElementById('loader');
        setTimeout(function () {
            loader.classList.add('fadeOut');
        }, 300);
    });</script>

<div id="ui"></div>

<script type="text/javascript" src="{{asset('js/jquery3.4.1.min.js')}}"></script>
<script type="text/javascript" src="{{asset('vendor.js')}}"></script>
<script type="text/javascript" src="{{asset('bundle.js')}}"></script>
<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js" integrity="sha512-hDWGyh+Iy4Mr9AHOzUP2+Y0iVPn/BwxxaoSleEjH/i1o4EVTF/sh0/A1Syii8PWOae+uPr+T/KHwynoebSuAhw==" crossorigin="anonymous"></script>
<script type="text/javascript" src="{{ config('services.bluesnap.environment') == 'sandbox' ? 'https://sandbox.bluesnap.com' : 'https://ws.bluesnap.com' }}/web-sdk/4/bluesnap.js"></script>
<script type="text/javascript" src="{{asset('js/bs.js')}}"></script>

<script type="text/javascript" src="{{asset('js/UI.js')}}"></script>

</body>
</html>
