@extends('layouts.admin')

@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Coupons</div>
                    <div class="card-body">
                        <a href="{{route('admin.coupon.create')}}" class="btn btn-primary mr-auto">Add Coupon</a>
                        <table class="table table-hoved table-bordered">
                            <thead>
                            <th>Id</th>
                            <th>Coupon</th>
                            <th>Actions</th>
                            </thead>
                            <tbody>
                            <td></td>
                            <td></td>
                            <td></td>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @endsection
