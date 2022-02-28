@extends('layouts/admin')
@section('page-title','Payment History')
@section('content')

<div class="contianer">
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

                                <td>{{$pricePlanSubscription->expires_at}} ($pricePlanSubscription->plan_duration)</td>
                                <td>${{@$pricePlanSubscription->pricePlan->price}}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>BlueSnap vaulted shopper id</th>
                                <th>Name</th>
                                <th>Card end with</th>
                                <th>Expiry</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
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
</div>


@endsection