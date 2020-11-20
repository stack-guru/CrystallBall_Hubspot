@extends('layouts.admin')
@section('page-title','Users')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Users</div>

                <div class="card-body">
                    <table class="table table-hoved table-bordered">
                        <thead>
                            <tr><th>Email</th><th>Name</th><th>Price Plan</th>
                                <th>Registration Date</th><th>User's last added annotation</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->pricePlan->name }}</td>
                                    <td>{{ @$user->created_at }}</td>
                                    <td>{{ $user->lastAnnotation->updated_at}}</td>
                                    <td>
                                        <div class="row ml-0 mr-0 d-flex flex-row ">

                                        <a class="btn btn-primary m-2" href="{{ route('admin.user.edit', $user->id) }}">Edit</a>
                                        <form id="deleteUserForm{{$user->id}}" method="POST" action="{{ route('admin.user.destroy', $user->id) }}">
                                            @csrf @method("DELETE")
                                        </form>
                                        <button type="button" onclick="document.getElementById('deleteUserForm{{$user->id}}').submit()" class="btn btn-danger m-2">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr><th>Email</th><th>Name</th><th>Price Plan</th><th>Registration Date</th><th>User's last added annotation</th><th>Actions</th></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
