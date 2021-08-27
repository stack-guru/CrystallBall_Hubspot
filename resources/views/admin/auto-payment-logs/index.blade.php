@extends('layouts/admin')
@section('page-title','Auto Payment Logs')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Auto Payment Logs</div>
                <div class="card-body">
                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>BlueSnap</th>
                                <th>User</th>
                                <th>Payment Detail</th>
                                <th>Price Plan Subscription Transaction</th>
                                <th>Price Plan</th>
                                <th>Card</th>
                                <th>Transaction Message</th>
                                <th>Charged Price</th>
                                <th>Was Successful</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($autoPaymentLogs as $autoPaymentLog)
                            <tr>
                                <td>{{$autoPaymentLog->paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>{{$autoPaymentLog->user->name}}</td>
                                <td>{{$autoPaymentLog->paymentDetail->first_name}} {{$autoPaymentLog->paymentDetail->last_name}}</td>
                                <td>{{@$autoPaymentLog->pricePlanSubscription->transaction_id}}</td>
                                <td>{{$autoPaymentLog->pricePlan->name}}</td>
                                <td>{{$autoPaymentLog->card_number}}</td>
                                <td>{{$autoPaymentLog->transaction_message}}</td>
                                <td>{{$autoPaymentLog->charged_price}}</td>
                                <td>{{$autoPaymentLog->was_successful}}</td>
                                <td>{{$autoPaymentLog->created_at}}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="9" class="alert-danger">No record Found</td>
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