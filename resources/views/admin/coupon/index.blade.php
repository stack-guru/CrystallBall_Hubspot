@extends('layouts.admin')
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
                                <a href="{{route('admin.coupon.create')}}" class="btn btn-primary my-3">Add Coupon</a>

                            </div>
                        </div>
                        <table class="table table-hoved table-bordered">
                            <thead>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Discount Percent</th>
                            <th>Expire At</th>
                            <th>Actions</th>
                            </thead>
                            <tbody>
                            @forelse($coupons as $coupon)
                                <tr>
                                    <td>{{$coupon->id}}</td>
                                    <td>{{$coupon->name}}</td>
                                    <td>{{$coupon->code}}</td>
                                    <td>{{$coupon->discount_percent}}</td>
                                    <td>{{$coupon->expires_at->todateString()}}</td>
                                    <td class="d-flex flex-row">
                                        <a href="{{route('admin.coupon.edit',$coupon->id)}}" class="btn btn-primary m-2">Edit</a>
                                        <form action="{{route('admin.coupon.destroy',$coupon->id)}}" method="post">
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
