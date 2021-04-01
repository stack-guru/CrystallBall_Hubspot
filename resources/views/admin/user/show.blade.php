@extends('layouts.admin')

@section('page-title','Edit Users')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">User</div>

                <div class="card-body">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  class="form-control" type="text" name="name" id="name" value="{{ $user->name }}" disabled>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input  class="form-control" type="email" name="email" id="email" value="{{ $user->email }}" disabled>
                        </div>
                        <div class="form-group">
                            <label for="email">Price Plan: </label>
                            {{ $user->pricePlan->name }}
                        </div>
                        <div class="form-group">
                            <label for="pricePlanExpiryDate">Price Plan Expiry Date</label> 
                            <input  class="form-control" type="date" name="price_plan_expiry_date" id="pricePlanExpiryDate" value="{{ $user->price_plan_expiry_date }}" disabled>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="{{ route('admin.user.edit', $user->id) }}" class="btn btn-primary btn-sm">Edit</a>
                    </div>
                </div>
        </div>
    </div>
</div>
@endsection
