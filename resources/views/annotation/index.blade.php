<!DOCTYPE html>
<html lang="en">

<head>
    <title>Annotations</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css?family=Prata&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/css/open-iconic-bootstrap.min.css">
    <link rel="stylesheet" href="/css/animate.css">

    <link rel="stylesheet" href="/css/owl.carousel.min.css">
    <link rel="stylesheet" href="/css/owl.theme.default.min.css">
    <link rel="stylesheet" href="/css/magnific-popup.css">

    <link rel="stylesheet" href="/css/aos.css">

    <link rel="stylesheet" href="/css/ionicons.min.css">

    <link rel="stylesheet" href="/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="/css/nouislider.css">


    <link rel="stylesheet" href="/css/flaticon.css">
    <link rel="stylesheet" href="/css/icomoon.css">
    <link rel="stylesheet" href="/css/style.css">
</head>

<body>

    <div class="main-section">

        <!-- <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
	    <div class="container">
	      <a class="navbar-brand" href="/"><img src="{{ url('/images/logo.png') }}" width="100px" height="100px"/></a>
	      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
	        <span class="oi oi-menu"></span> Menu
	      </button>
	      <div class="collapse navbar-collapse" id="ftco-nav">
	        <ul class="navbar-nav ml-auto">
	        	<li class="dropdown nav-item">
              <a href="#" class="dropdown-toggle nav-link icon d-flex align-items-center" data-toggle="dropdown">
                <i class="ion-ios-apps mr-2"></i>
                components
                <b class="caret"></b>
              </a>
              <div class="dropdown-menu dropdown-menu-left">
                <a href="#" class="dropdown-item"><i class="ion-ios-apps mr-2"></i> All components</a>
                <a href="#" class="dropdown-item"><i class="ion-ios-document mr-2"></i> Documentation</a>
              </div>
            </li>
	          <li class="nav-item"><a href="#" class="nav-link icon d-flex align-items-center"><i class="ion-ios-cloud-download mr-2"></i> Download</a></li>
	          <li class="nav-item"><a href="#" class="nav-link icon d-flex align-items-center"><i class="ion-logo-facebook"></i></a></li>
	          <li class="nav-item"><a href="#" class="nav-link icon d-flex align-items-center"><i class="ion-logo-twitter"></i></a></li>
	          <li class="nav-item"><a href="#" class="nav-link icon d-flex align-items-center"><i class="ion-logo-instagram"></i></a></li>
	        </ul>
	      </div>
		  </div>
	  </nav> -->
        <!-- END nav -->

        <!-- <section class="hero-wrap js-fullheight">
  		<div class="container">
  			<div class="row description js-fullheight align-items-center justify-content-center">
  				<div class="col-md-8 text-center">
  					<div class="text">
  						<h1>Tools UI Kit.</h1>
  						<h4 class="mb-5">Free Bootstrap 4 UI Kit on Tools Design.</h4>
  						<p><a href="#" class="btn btn-white px-4 py-3"><i class="ion-ios-cloud-download mr-2"></i>Download Tools</a></p>
  					</div>
  				</div>
  			</div>
  		</div>
  	</section> -->

        <section class="ftco-section pb-0">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 heading-title">
                        <h1>Annotations</h1>
                    </div>
                </div>
            </div>
        </section>

        @include("annotation/messages")

        <section class="ftco-section" id="buttons">
            <div class="container">
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="heading-section">Upload Annotations <br>
                            <small>Upload all your annotations using CSV</small>
                        </h2>
                    </div>
                </div>

                <form method="POST" action="{{ route('annotation.upload') }}" enctype="multipart/form-data">
                    <div class="row">
                        @csrf
                        <div class="col-lg-12 col-sm-12">
                            <div class="form-group @if($errors->has('csv')) has-danger @endif">
                                <input type="file" class="form-control" id="csv" name="csv" required>
                                <label for="csv" class="form-control-placeholder">CSV</label>
                                @if($errors->has('csv'))
                                <span class="bmd-help">{{ $errors->first('csv') }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1 offset-11">
                            <button type="submit" class="btn btn-primary btn-fab btn-round">
                                <i class="ion-ios-upload"></i>
                              </button>
                        </div>
                    </div>
                </form>

            </div>
        </section>
        <!-- - - - - -end- - - - -  -->


        <section class="ftco-section" id="buttons">
            <div class="container">
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="heading-section">Add Annotation <br>
                            <small>Enter your annotation details</small>
                        </h2>
                    </div>
                </div>

                <form method="POST" action="{{ route('annotation.store') }}">
                    <div class="row">
                        @csrf
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('category')) has-danger @endif">
                                <input type="text" class="form-control" id="category" name="category" required>
                                <label for="category" class="form-control-placeholder">Category</label>
                                @if($errors->has('category'))
                                <span class="bmd-help">{{ $errors->first('category') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('event_type')) has-danger @endif">
{{--                                <input type="text" class="form-control" id="event_type" name="event_type" required>--}}
                                <select class="form-control" name="event_type" id="event_type" required>
{{--            select option added by muhammad zeeshan                     --}}
                                    <option value="Default" selected>Default</option>
                                    <option value="Annotaions">Annotaions</option>
                                    <option value="Api">Api</option>
                                    <option value="Google-updates">Google-updates</option>
                                    <option value="Holidays">Holidays</option>
                                    <option value="Gtm">Gtm</option>
                                </select>
                                <label for="event_type" class="form-control-placeholder">event_type</label>
                                @if($errors->has('event_type'))
                                <span class="bmd-help">{{ $errors->first('event_type') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('event_name')) has-danger @endif">
                                <input type="text" class="form-control" id="event_name" name="event_name" required>
                                <label for="event_name" class="form-control-placeholder">event_name</label>
                                @if($errors->has('event_name'))
                                <span class="bmd-help">{{ $errors->first('event_name') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('url')) has-danger @endif">
                                <input type="text" class="form-control" id="url" name="url">
                                <label for="url" class="form-control-placeholder">url</label>
                                @if($errors->has('url'))
                                <span class="bmd-help">{{ $errors->first('url') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('description')) has-danger @endif">
                                <textarea type="text" class="form-control" id="description" name="description"></textarea>
                                <label for="description" class="form-control-placeholder">description</label>
                                @if($errors->has('description'))
                                <span class="bmd-help">{{ $errors->first('description') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('title')) has-danger @endif">
                                <input type="text" class="form-control" id="title" name="title" required>
                                <label for="title" class="form-control-placeholder">title</label>
                                @if($errors->has('title'))
                                <span class="bmd-help">{{ $errors->first('title') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('show_at')) has-danger @endif">
                                <input type="date" class="form-control" id="show_at" name="show_at" required>
                                <label for="show_at" class="form-control-placeholder">show_at</label>
                                @if($errors->has('show_at'))
                                <span class="bmd-help">{{ $errors->first('show_at') }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-4">
                            <div class="form-group @if($errors->has('type')) has-danger @endif">
                                <input type="text" class="form-control" id="type" name="type" required>
                                <label for="type" class="form-control-placeholder">type</label>
                                @if($errors->has('type'))
                                <span class="bmd-help">{{ $errors->first('type') }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1 offset-11">
                            <button type="submit" class="btn btn-primary btn-fab btn-round" title="submit">
                                <i class="ion-ios-plus"></i>
                              </button>
                        </div>
                    </div>
                </form>

            </div>
        </section>
        <!-- - - - - -end- - - - -  -->

        <section class="ftco-section bg-light" id="inputs">
            <div class="container">
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="heading-section">Your annotations</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-hover table-bordered">
                            <thead><tr><td>Title</td><td>Description</td><td>Show At</td><td>Actions</td></tr></thead>
                            <tbody>
                                @foreach ($annotations as $annotation)
                                    <tr>
                                        <td>{{ $annotation->title }}</td>
                                        <td>{{ $annotation->description }}</td>
                                        <td>{{ $annotation->show_at }}</td>
                                        <td>
                                            <form id="an-del-form-{{$annotation->id}}" action="{{ route('annotation.destroy', $annotation->id) }}" method="post">
                                                @csrf
                                                @method('DELETE')
                                            </form>
                                            <button type="button" onclick="document.getElementById('an-del-form-{{$annotation->id}}').submit();" class="btn btn-danger"><i class="ion-ios-trash"></i></button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                            @if(count($annotations) > 10)
                                <tfoot><tr><td>Title</td><td>Description</td><td>Show At</td><td>Actions</td></tr></tfoot>
                            @endif
                        </table>
                    </div>
                    <div class="col-12">{{ $annotations->links() }}</div>
                </div>
            </div>
        </section>
        <!-- - - - - -end- - - - -  -->



        <footer class="ftco-section ftco-section-2">
            <div class="col-md-12 text-center">
                <p class="mb-0">
                    <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
                    Copyright &copy;
                    <script>
                        document.write(new Date().getFullYear());

                    </script> All rights reserved | This template is made with <i class="icon-heart"
                        aria-hidden="true"></i> by
                    <a href="https://colorlib.com" target="_blank">Colorlib</a>
                    <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
                </p>
            </div>
        </footer>

    </div>

    <!-- loader -->
    <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px">
            <circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
            <circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10"
                stroke="#F96D00" /></svg></div>


    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery-migrate-3.0.1.min.js"></script>
    <script src="/js/popper.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/jquery.easing.1.3.js"></script>
    <script src="/js/jquery.waypoints.min.js"></script>
    <script src="/js/jquery.stellar.min.js"></script>
    <script src="/js/owl.carousel.min.js"></script>
    <script src="/js/jquery.magnific-popup.min.js"></script>
    <script src="/js/aos.js"></script>

    <script src="/js/nouislider.min.js"></script>
    <script src="/js/moment-with-locales.min.js"></script>
    <script src="/js/bootstrap-datetimepicker.min.js"></script>
    <script src="/js/main.js"></script>

</body>

</html>
