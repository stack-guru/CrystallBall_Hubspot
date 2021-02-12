@extends('layouts.admin')
@section('page-title','Cookie Coupons')
@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 p-5">
                <div class="card">
                    <div class="card-header">Cookie Coupons</div>
                    <div class="card-body">
                        <div class="row ml-0 mr-0">
                            <div class="col-12 text-right">
                                <a href="{{route('admin.cookie-coupon.create')}}" class="btn btn-primary my-3">Add Cookie Coupon</a>

                            </div>
                        </div>
                        <table class="table table-hoved table-bordered">
                            <thead>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>URL</th>
                            <th>Actions</th>
                            </thead>
                            <tbody>
                            @forelse($cookieCoupons as $cookieCoupon)
                                <tr>
                                    <td>{{$cookieCoupon->id}}</td>
                                    <td>{{$cookieCoupon->name}}</td>
                                    <td>{{$cookieCoupon->code}}</td>
                                    <td>{{ route('register', ['coupon_code' => $cookieCoupon->code]) }}</td>
                                    <td class="d-flex flex-row">
                                        <a href="{{route('admin.cookie-coupon.edit',$cookieCoupon->id)}}" class="btn btn-primary m-2">Edit</a>
                                        <form action="{{route('admin.cookie-coupon.destroy',$cookieCoupon->id)}}" method="post">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"  class="btn btn-danger m-2">Delete</button>

                                        </form>

                                    </td>

                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center alert-danger">Cookie Coupons not found</td></tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @endsection
