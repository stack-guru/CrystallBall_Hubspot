@extends('layouts/spectator')
@section('page-title','Coupons')
@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 p-5">
                <div class="card">
                    <div class="card-header">Coupons</div>
                    <div class="card-body">
                        <div class="row ml-0 mr-0">
                            <div class="col-12 text-right">
                                <a href="{{route('spectator.coupon.create')}}" class="btn btn-primary my-3">Add Coupon</a>

                            </div>
                        </div>
                        <table aria-label="Coupons" class="table table-hoved table-bordered">
                            <thead>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Code</th>
                            <th scope="col">Discount Percent</th>
                            <th scope="col">Recurring Count</th>
                            <th scope="col">Expire At</th>
                            <th scope="col">Actions</th>
                            </thead>
                            <tbody>
                            @forelse($coupons as $coupon)
                                <tr>
                                    <td>{{$coupon->id}}</td>
                                    <td>{{$coupon->name}}</td>
                                    <td>{{$coupon->code}}</td>
                                    <td>{{$coupon->discount_percent}}</td>
                                    <td>{{$coupon->recurring_discount_count}}</td>
                                    <td>{{$coupon->expires_at->todateString()}}</td>
                                    <td class="d-flex flex-row">
                                        <a href="{{route('spectator.coupon.edit',$coupon->id)}}" class="btn btn-primary m-2">Edit</a>
                                        <form action="{{route('spectator.coupon.destroy',$coupon->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"  class="btn btn-danger m-2">Delete</button>

                                        </form>

                                    </td>

                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center alert-danger">Coupons not found</td></tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @endsection
