@extends('layouts/admin')
@section('page-title','Payment Details')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Payment Details</div>
                <div class="card-body">
                    <table class="table table-hover table-bordered ">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Card</th>
                                <th>Expiry</th>
                                <th>Name</th>
                                <th>Billing Address</th>
                                <th>BlueSnap Vaulted Shopper Id</th>
                                <th>User</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($paymentDetails as $paymentDetail)
                            <tr>
                                <td>{{$paymentDetail->id}}</td>
                                <td>{{$paymentDetail->card_number}}</td>
                                <td>{{$paymentDetail->expiry_month}} / {{$paymentDetail->expiry_year}}</td>
                                <td>{{$paymentDetail->first_name}} {{$paymentDetail->last_name}}</td>
                                <td>
                                    {{$paymentDetail->billing_address}}<br />
                                    {{$paymentDetail->city}}, {{$paymentDetail->zip_code}}<br />
                                    {{$paymentDetail->country}}
                                </td>
                                <td>{{$paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>{{$paymentDetail->user->email}}</td>
                                <td>{{$paymentDetail->created_at}}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="8" class="alert-danger">No record Found</td>
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