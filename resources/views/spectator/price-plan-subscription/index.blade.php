@extends('layouts/spectator')
@section('page-title','Payment History')
@section('content')

<div class="container">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Payment History</div>
                <div class="card-body">
                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">User</th>
                                <th scope="col">User email</th>
                                <th scope="col">BlueSnap vaulted shopper id</th>
                                <th scope="col">Coupon / Discount</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Paid at</th>
                                <th scope="col">Card end with</th>
                                <th scope="col">Next Billing At (Duration)</th>
                                <th scope="col">Plan Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($pricePlanSubscriptions as $pricePlanSubscription)
                            <tr>
                                <td>{{$pricePlanSubscription->id}}</td>
                                <td>
                                    {{$pricePlanSubscription->user->name}}
                                    <!-- 
                                        The logic below is used to track AppSumo refunds.
                                        This logic is not much appreciated and should be 
                                        replaced with something proper  in future
                                    -->
                                    @if(!@$pricePlanSubscription->pricePlan->price && $pricePlanSubscription->app_sumo_invoice_item_uuid)
                                        <span class="badge badge-danger">REFUND</span>
                                    @endif
                                </td>
                                <td>{{$pricePlanSubscription->user->email}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>@if($pricePlanSubscription->coupon){{$pricePlanSubscription->coupon->code}} / {{$pricePlanSubscription->coupon->discount_percent}}%@endif</td>
                                <td>${{$pricePlanSubscription->charged_price}}</td>
                                <td>{{$pricePlanSubscription->created_at->todateString()}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->card_number}}</td>

                                <td>{{$pricePlanSubscription->expires_at}} ({{$pricePlanSubscription->plan_duration}})</td>
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