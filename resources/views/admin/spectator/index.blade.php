@extends('layouts.admin')
@section('page-title','Spectators')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css"/>
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Spectators
                    <a class="btn btn-primary float-right" href="{{ route('admin.spectator.create') }}">Add</a>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table aria-label="Spectators" class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th scope="col">Email</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Pages</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($spectators as $spectator)
                                    <tr>
                                        <td>{{ $spectator->email }}</td>
                                        <td>{{ $spectator->name }}</td>
                                        <td>{{ $spectator->permissions()->pluck('source')->implode(', ') }}</td>
                                        <td>@if($spectator->created_at){{ $spectator->created_at->format('Y-m-d') }}@endif</td>
                                        <td>
                                            <div class="row ml-0 mr-0 d-flex flex-row ">
                                            <a class="btn btn-primary m-2" href="{{ route('admin.spectator.edit', $spectator->id) }}">Edit</a>
                                            <form id="deleteUserForm{{$spectator->id}}" method="POST" action="{{ route('admin.spectator.destroy', $spectator->id) }}">
                                                @csrf @method("DELETE")
                                            </form>
                                            <button type="button" onclick="if(confirm('Do you really want to delete this entity?')) document.getElementById('deleteUserForm{{$spectator->id}}').submit();" class="btn btn-danger m-2">Delete</button>

                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
<script>
    $(document).ready( function () {
        $('#myTable').DataTable();
    } );
</script>
@endsection
