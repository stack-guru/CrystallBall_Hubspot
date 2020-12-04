@if ($errors->any())
<div class="row">
    <div class="col-12">
      <div class="callout callout-danger">
        <h5><i class="fas fa-times"></i> Error(s):</h5>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
      </div>
    </div>
  </div>
@endif

@if(session('success'))
<div class="row">
    <div class="col-12">
      <div class="callout callout-success">
        <h5><i class="fa fa-check"></i> Done!</h5>
      </div>
    </div>
  </div>
@endif

@if(session('error'))
<div class="row">
    <div class="col-12">
      <div class="callout callout-danger">
        <h5><i class="fas fa-times"></i> Error!</h5>
        <p>{{session('error')}}</p>
      </div>
    </div>
  </div>
@endif
