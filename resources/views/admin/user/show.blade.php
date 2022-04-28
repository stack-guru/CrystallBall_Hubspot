@extends('layouts.admin')

@section('page-title','Edit Users')

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">User</div>

                <div class="card-body">
                    <div class="form-group">
                        <label for="name">Name: </label>
                        {{ $user->name }}
                    </div>
                    <div class="form-group">
                        <label for="email">Email: </label>
                        {{ $user->email }}
                    </div>
                    <div class="form-group">
                        <label for="email">Price Plan: </label>
                        {{ $user->pricePlan->name }}
                    </div>
                    <div class="form-group">
                        <label for="pricePlanExpiryDate">Price Plan Expiry Date: </label>
                        {{ $user->price_plan_expiry_date }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @foreach($user->pricePlanSubscriptions as $pricePlanSubscription)
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-10 p-5">
            <div class="card">
                <div class="card-header">Payment History</div>
                <div class="card-body">
                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>User email</th>
                                <th>Coupon / Discount</th>
                                <th>Amount</th>
                                <th>Paid at</th>
                                <th>Next Billing At (Duration)</th>
                                <th>Plan Name</th>
                                <th>Plan Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{$pricePlanSubscription->id}}</td>
                                <td>{{$pricePlanSubscription->user->name}}</td>
                                <td>{{$pricePlanSubscription->user->email}}</td>
                                <td>@if($pricePlanSubscription->coupon){{$pricePlanSubscription->coupon->code}} / {{$pricePlanSubscription->coupon->discount_percent}}%@endif</td>
                                <td>${{$pricePlanSubscription->charged_price}}</td>
                                <td>{{$pricePlanSubscription->created_at->todateString()}}</td>

                                <td>{{$pricePlanSubscription->expires_at}} ({{$pricePlanSubscription->plan_duration}})</td>
                                <td>{{@$pricePlanSubscription->pricePlan->name}}</td>
                                <td>${{@$pricePlanSubscription->pricePlan->price}}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Company Registration Number</th>
                                <th>Company Phone Number</th>
                                <th>BlueSnap vaulted shopper id</th>
                                <th>Name</th>
                                <th>Card end with</th>
                                <th>Expiry</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{@$pricePlanSubscription->paymentDetail->company_name}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->company_registration_number}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->phone_number_prefix}} {{@$pricePlanSubscription->paymentDetail->phone_number}}</td>

                                <td>{{@$pricePlanSubscription->paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->first_name}} {{@$pricePlanSubscription->paymentDetail->last_name}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->card_number}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->expiry_month}} / {{@$pricePlanSubscription->paymentDetail->expiry_year}}</td>
                                <td>
                                    {{@$pricePlanSubscription->paymentDetail->billing_address}}<br />
                                    {{@$pricePlanSubscription->paymentDetail->city}} {{@$pricePlanSubscription->paymentDetail->country}}<br />
                                    {{@$pricePlanSubscription->paymentDetail->zip_code}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    @endforeach
</div>
</div>
</div>
@endsection