@extends('layouts.admin')
@section('page-title','Price Plans')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Price Plans</div>

                <div class="card-body">
                    <a href="{{ route('admin.price-plan.create') }}" class="btn btn-primary">Add</a>
                    <table aria-label="Price Plans" class="table table-hoved table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($pricePlans as $pricePlan)
                            <tr>
                                <td>{{ $pricePlan->code }}</td>
                                <td>{{ $pricePlan->name }}</td>
                                <td>{{ $pricePlan->price }}</td>
                                <td>
                                    <a class="btn btn-default" href="{{ route('admin.price-plan.edit', $pricePlan->id) }}">Edit</a>
                                    <form id="deletePricePlanForm{{$pricePlan->id}}" method="POST" action="{{ route('admin.price-plan.destroy', $pricePlan->id) }}">
                                        @csrf @method("DELETE")
                                    </form>
                                    <button type="button" onclick="if(confirm('Do you really want to delete this entity?')) document.getElementById('deletePricePlanForm{{$pricePlan->id}}').submit();" class="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection