@extends('layouts/auth')

@section('page-title', 'Register')
@section('meta-description', 'Signup to ' . config('app.name') . ' and automate Google Analytics Annotations')

@section('content')
    <div class='container formAndSlider'>
        <div class='row align-items-center m-0'>
            <div class='col-6 p-0'>
                <form class="form-signin" method="POST" action="{{ route('register') }}">
                @csrf
                    <h2>Get started for Free</h2>
                    {{-- <div class="themeNewInputStyle mb-3">
                        <input type="text" id="inputName" class="form-control @error('name') is-invalid @enderror" placeholder="Full Name" required="" autofocus="" name="name" value="{{ old('name') }}">
                        @error('name')
                        <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div> --}}
                    <div class="themeNewInputStyle mb-3">
                        <input type="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="Email address" required="" autofocus="" name="email" value="{{ old('email') }}">
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="py-2 mb-3 d-flex justify-content-center">
                        <label class="d-flex align-items justify-content-end serviceCheckBox m-0" for="read_confirmation">
                            <input type="checkbox" class="form-check-input @error('read_confirmation') is-invalid @enderror" name="read_confirmation" id="read_confirmation" />
                            <span>By signing up, you agree to our <a href="https://crystalballinsight.com/privacy-policy" target="_blank">privacy policy</a></span>
                        </label>
                        @error('read_confirmation')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-label-group" style="padding-left: 12%;">
                        @error('g-recaptcha-response')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                        <div class="g-recaptcha" data-sitekey="{{config('services.recaptcha.client.key')}}" data-callback="gRecaptchaSuccessCallBack" data-expired-callback="gRecaptchaExpireCallBack"></div>
                    </div>
                    <div class="mb-3"><button class="btn-theme" type="submit" id="registerButton" disabled>Register</button></div>
                    <div class="or text-center mb-3">
                        <span>or</span>
                    </div>
                    <div>
                        <a class="btn-google minified-provider" href="{{ route('socialite.google') }}">
                        <img class="oauth-logo" src="/images/google-logo.png" alt="google logo">
                        <span class="minified-provider-name">Sign up with Google</span>
                        </a>
                    </div>
                    {{-- <a class="btn btn-lg btn-primary btn-block" href="{{ route('login') }}">Login</a> --}}
                    {{-- <p>Already have an account? <a href="{{ route('login') }}">Login</a></p> --}}
                </form>
            </div>
            <div class='col-6 p-0'>
                <div class='sliderHolder'>
                    <div class="signup-slider">
                        <div class='slide'>
                            <h4>Create annotations for essential workspaces</h4>
                            <img src="/images/signup-slider-01.png" />
                        </div>
                        <div class='slide'>
                            <h4>Insights - predictions</h4>
                            <img src="/images/signup-slider-02.png" />
                        </div>
                        <div class='slide'>
                            <h4>Use AI and Google Analytics annotations to make more accurate predictions about your website's future performance</h4>
                            <img src="/images/signup-slider-03.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Confirmation email sent! screen Code -->
    <!-- <div class="container d-flex justify-content-center">
        <div class="confirmationContent d-flex flex-column text-center">
            <figure><img src='./icon-confirmation-email.svg'/></figure>
            <h1>Confirmation email sent!</h1>
            <p>Click on the confirmation link to verify your email</p>
            <span>Haven’t received the email yet? <a href=''>Resend</a></span>
            <em>Or</em>
            <span class='goback'>Incorrect email? <a href=''>Go back</a></span>
        </div>
    </div> -->

    <!-- Uh, oh... screen Code -->
    <!-- <div class="container d-flex justify-content-center">
        <div class="confirmationContent d-flex flex-column text-center">
            <h1>Uh, oh...</h1>
            <p>It appears that your company already has an active account, <a href='#'>Request an invitation</a> to join the account now.</p>
            <em>Or</em>
            <button class='btn-theme-outline'>Create a new Workspace</button>
            <hr />
            <span class='goback'>Incorrect email? <a href=''>Go back</a></span>
        </div>
    </div> -->

    <!-- Success! screen Code -->
    <!-- <div class="container d-flex justify-content-center">
        <div class="confirmationContent success d-flex flex-column text-center">
            <figure><img src='./icon-confirmation-email.svg'/></figure>
            <h1>Success!</h1>
            <p>We have sent the account holder an email with your request to join. <a href='#'>Contact Us</a> if you have any query.</p>
        </div>
    </div> -->
@endsection

@section('javascript')
    <script src="https://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>

    <script>
        function gRecaptchaSuccessCallBack(responseToken) {
            document.getElementById('registerButton').removeAttribute('disabled');
        }
        function gRecaptchaExpireCallBack() {
            document.getElementById('registerButton').setAttribute('disabled', true);
        }
        $('.signup-slider').slick({
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    </script>
@endsection
