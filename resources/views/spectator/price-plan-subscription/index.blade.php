@extends('layouts/spectator')
@section('page-title','Payment History')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Payment History</div>
                <div class="card-body">
                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>User email</th>
                                <th>BlueSnap vaulted shopper id</th>
                                <th>Coupon / Discount</th>
                                <th>Amount</th>
                                <th>Paid at</th>
                                <th>Card end with</th>
                                <th>Next Billing At</th>
                                <th>Plan Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($pricePlanSubscriptions as $pricePlanSubscription)
                            <tr>
                                <td>{{$pricePlanSubscription->id}}</td>
                                <td>{{$pricePlanSubscription->user->name}}</td>
                                <td>{{$pricePlanSubscription->user->email}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>@if($pricePlanSubscription->coupon){{$pricePlanSubscription->coupon->code}} / {{$pricePlanSubscription->coupon->discount_percent}}%@endif</td>
                                <td>${{$pricePlanSubscription->charged_price}}</td>
                                <td>{{$pricePlanSubscription->created_at->todateString()}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->card_number}}</td>

                                <td>{{$pricePlanSubscription->created_at->addMonths(1)->todateString()}}</td>
                                <td>${{@$pricePlanSubscription->pricePlan->price}}</td>
                                <td>
                                    <a href="{{ route('spectator.price-plan-subscription.show', $pricePlanSubscription->id) }}" class="btn btn-sm btn-primary">Show</a>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="11" class="alert-danger">No record Found</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection