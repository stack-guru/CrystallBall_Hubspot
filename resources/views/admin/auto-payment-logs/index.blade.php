@extends('layouts/admin')
@section('page-title','Auto Payment Logs')
@section('content')

<div class="container">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Auto Payment Logs</div>
                <div class="card-body">
                    <table aria-label="Auto Payment Logs" class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th scope="col">BlueSnap</th>
                                <th scope="col">User</th>
                                <th scope="col">Payment Detail</th>
                                <th scope="col">Price Plan Subscription Transaction</th>
                                <th scope="col">Price Plan</th>
                                <th scope="col">Card</th>
                                <th scope="col">Transaction Message</th>
                                <th scope="col">Charged Price</th>
                                <th scope="col">Was Successful</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Actions</th>
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
                                <td>
                                    <a href="{{ route('admin.deduct-payment.create', ['user_id' => $autoPaymentLog->user_id, 'payment_detail_id' => $autoPaymentLog->paymentDetail->id, 'amount' => $autoPaymentLog->charged_price]) }}" class="btn btn-primary">Charge</a>
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