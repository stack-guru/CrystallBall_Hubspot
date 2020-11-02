@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Price Plans</div>

                <div class="card-body">
                    <a href="{{ route('admin.price-plan.create') }}" class="btn btn-primary">Add</a>
                    <table class="table table-hoved table-bordered">
                        <thead>
                            <tr><th>Name</th><th>Price</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            @foreach($pricePlans as $pricePlan)
                                <tr>
                                    <td>{{ $pricePlan->name }}</td>
                                    <td>{{ $pricePlan->price }}</td>
                                    <td>
                                        <a class="btn btn-default" href="{{ route('admin.price-plan.edit', $pricePlan->id) }}">Edit</a>
                                        <form id="deletePricePlanForm{{$pricePlan->id}}" method="POST" action="{{ route('admin.price-plan.destroy', $pricePlan->id) }}">
                                            @csrf @method("DELETE")
                                        </form>
                                        <button type="button" onclick="document.getElementById('deletePricePlanForm{{$pricePlan->id}}').submit()" class="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr><th>Name</th><th>Price</th><th>Actions</th></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
