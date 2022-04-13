@extends('layouts.admin')
@section('page-title','Registration Offers')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Registration Offers</div>

                <div class="card-body">
                    <a href="{{ route('admin.registration-offer.create') }}" class="btn btn-primary">Add</a>
                    <table class="table table-hoved table-bordered">
                        <thead>
                            <tr><th>Name</th><th>Code</th><th>Heading</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            @foreach($registrationOffers as $registrationOffer)
                                <tr>
                                    <td>{{ $registrationOffer->name }}</td>
                                    <td>{{ $registrationOffer->code }}</td>
                                    <td>{{ $registrationOffer->heading }}</td>
                                    <td>
                                        <a class="btn btn-default" href="{{ route('admin.registration-offer.edit', $registrationOffer->id) }}">Edit</a>
                                        <form id="deletePricePlanForm{{$registrationOffer->id}}" method="POST" action="{{ route('admin.registration-offer.destroy', $registrationOffer->id) }}">
                                            @csrf @method("DELETE")
                                        </form>
                                        <button type="button" onclick="if(confirm('Do you really want to delete this entity?')) document.getElementById('deletePricePlanForm{{$registrationOffer->id}}').submit();" class="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr><th>Name</th><th>Code</th><th>Heading</th><th>Actions</th></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
