@extends('layouts.admin')
@section('page-title','Add Coupon')
@section('content')
    <div class="container-xl bg-white  " >
        <div class="row ml-0 mr-0">
            <div class="col-12 d-flex justify-content-center align-items-center flex-column">
                <div style="width: 50%">
                <form action="{{route('admin.coupon.store')}}" method="post">
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
                        <label for="discount_percent">Discount Percent</label>
                        <input type="text" name="discount_percent" id="discount_percent" class="form-control">
                        @error('discount_percent')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="recurring_discount_count">Number of recurring discounts</label>
                        <input type="number" name="recurring_discount_count" id="recurring_discount_count" class="form-control">
                        @error('recurring_discount_count')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="expires_at">Expiry</label>
                        <input type="date" name="expires_at" id="expires_at" class="form-control">
                        @error('expires_at')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="row ml-0 mr-0">
                        <div class="col-12 text-right">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>

                </form>
                </div>
            </div>
        </div>
    </div>

    @endsection
