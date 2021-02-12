@extends('layouts.admin')
@section('page-title','Add Cookie Coupon')
@section('content')
    <div class="container-xl bg-white  " >
        <div class="row ml-0 mr-0">
            <div class="col-12 d-flex justify-content-center align-items-center flex-column">
                <div style="width: 50%">
                <form action="{{route('admin.cookie-coupon.store')}}" method="post">
                    @csrf
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" name="name" id="name" class="form-control">
                        @error('name')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="code">Code</label>
                        <input type="text" name="code" id="code" class="form-control">
                        @error('code')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="plan_extension_days">Plan Extension Days</label>
                        <input type="text" name="plan_extension_days" id="plan_extension_days" class="form-control">
                        @error('plan_extension_days')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    

                    <div class="row ml-0 mr-0">
                        <div class="col-12 text-right">
                            <button type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </div>

                </form>
                </div>
            </div>
        </div>
    </div>

    @endsection
