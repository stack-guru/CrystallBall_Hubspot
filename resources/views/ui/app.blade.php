<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <title>Dashboard</title>
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
</head>
<body >
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

<script type="text/javascript" src="{{asset('vendor.js')}}"></script>
<script type="text/javascript" src="{{asset('bundle.js')}}"></script>
<script type="text/javascript" src="{{asset('js/Main.js')}}"></script>

</body>
</html>
