@extends('layouts/admin')

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
                        <th>BlueSnap vaulted shopper id</th>
                        <th>Amount</th>
                        <th>Paid at</th>
                        <th>Card end with</th>
                    </tr>
                    </thead>
                    <tbody>
                    @forelse($payments as $payment)
                    <tr>
                        <td>{{$payment->id}}</td>
                        <td>{{$payment->user->name}}</td>
                        <td>{{$payment->user->email}}</td>
                        <td>{{$payment->bluesnap_vaulted_shopper_id}}</td>
                        <td>${{$payment->charged_price}}</td>
                        <td>{{$payment->created_at->todateString()}}</td>
                        <td>{{$payment->card_number}}</td>
                    </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="alert-danger">No record Found</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>

@endsection
