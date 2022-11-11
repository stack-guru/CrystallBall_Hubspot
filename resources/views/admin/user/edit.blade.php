@extends('layouts.admin')

@section('page-title','Edit Users')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form method="POST" action="{{ route('admin.user.update', $user->id) }}">
            <div class="card">
                <div class="card-header">Edit User</div>

                <div class="card-body">
                        @csrf @method('PUT')
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  class="form-control" type="text" name="name" id="name" value="{{ $user->name }}" >
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input  class="form-control" type="email" name="email" id="email" value="{{ $user->email }}" >
                        </div>
                        <div class="form-group">
                            <label for="email">Price Plan</label>
                            <select name="price_plan_id" id="pricePlanId" class="form-control">
                                @foreach($pricePlans as $pricePlan)
                                    <option value="{{ $pricePlan->id }}" @if($pricePlan->id == $user->price_plan_id) selected @endif>{{ $pricePlan->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pricePlanExpiryDate">Price Plan Expiry Date</label>
                            <input  class="form-control" type="date" name="price_plan_expiry_date" id="pricePlanExpiryDate" value="{{ $user->price_plan_expiry_date }}" >
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="is_billing_enabled" id="isBillingEnabled" class="form-check-input" @if($user->is_billing_enabled) checked @endif />
                            <label class="form-check-label" for="isBillingEnabled">Is billing enabled?</label>
                        </div>
                    </div>
                    <div class="card-footer">
                        <input type="submit" value="Save" class="btn btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
