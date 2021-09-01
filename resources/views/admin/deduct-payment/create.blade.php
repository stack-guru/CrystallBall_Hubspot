@extends('layouts.admin')
@section('page-title','Deduct Payment')
@section('content')
    <div class="container-xl bg-white  " >
        <div class="row ml-0 mr-0">
            <div class="col-12 d-flex justify-content-center align-items-center flex-column">
                <div style="width: 50%">
                <form action="{{route('admin.deduct-payment.store')}}" method="post">
                    @csrf

                    <div class="form-group"><label>Name</label><input type="text" value="{{ $user->name }}" class="form-control" disabled></div>
                    <div class="form-group"><label>Email</label><input type="text" value="{{ $user->email }}" class="form-control" disabled></div>

                    <div class="form-group">
                        <label for="paymentDetail">Payment Detail</label>
                        <select name="payment_detail_id" id="paymentDetail" class="form-control">
                            @foreach($paymentDetails as $paymentDetail)
                                <option value="{{ $paymentDetail->id }}" @if($paymentDetailId == $paymentDetail->id) selected @endif>{{ $paymentDetail->card_number}} | {{ $paymentDetail->first_name }} {{ $paymentDetail->last_name }}</option>
                            @endforeach
                        </select>
                        @error('payment_detail_id')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="amount">Amount</label>
                        <input type="number" name="amount" id="amount" class="form-control" value="{{ $amount }}">
                        @error('amount')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="row ml-0 mr-0">
                        <div class="col-12 text-right">
                            <button type="submit" class="btn btn-primary">Charge</button>
                        </div>
                    </div>

                </form>
                </div>
            </div>
        </div>
    </div>

    @endsection
