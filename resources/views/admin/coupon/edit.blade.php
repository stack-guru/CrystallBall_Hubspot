@extends('layouts.admin')

@section('content')
    <div class="container-xl bg-white  " >
        <div class="row ml-0 mr-0">
            <div class="col-12 d-flex justify-content-center align-items-center flex-column">
                <div style="width: 50%">
                    @if($errors->any())
                        @foreach($errors->all() as $error)
                            <div class="alert alert-danger">{{$error}}</div>&nbsp;&nbsp;
                        @endforeach
                    @endif
                    <form action="{{route('admin.coupon.update',$coupon->id)}}" method="post">
                        @csrf
                        @method('PUT')
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" value="{{old('name',$coupon->name)}}" id="name" class="form-control">
                            @error('name')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="code">Code</label>
                            <input type="text" name="code" value="{{old('code',$coupon->code)}}" id="code" class="form-control">
                            @error('code')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="discount_percent">Discount Percent</label>
                            <input type="text" name="discount_percent" value="{{old('discount_percent',$coupon->discount_percent)}}"  id="discount_percent" class="form-control">
                            @error('discount_percent')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="expires_at">Expiry</label>
                            <input type="date" name="expires_at" value="{{old('expires_at',  $coupon->expires_at->todateString())}}" id="expires_at" class="form-control">
                            @error('expires_at')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>

                        <div class="row ml-0 mr-0">
                            <div class="col-12 text-right">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>


@endsection
