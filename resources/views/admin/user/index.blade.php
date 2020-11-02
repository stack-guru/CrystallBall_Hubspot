@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Users</div>

                <div class="card-body">
                    <table class="table table-hoved table-bordered">
                        <thead>
                            <tr><th>Email</th><th>Name</th><th>Price Plan</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->pricePlan->name }}</td>
                                    <td>
                                        <a class="btn btn-default" href="{{ route('admin.user.edit', $user->id) }}">Edit</a>
                                        <form id="deleteUserForm{{$user->id}}" method="POST" action="{{ route('admin.user.destroy', $user->id) }}">
                                            @csrf @method("DELETE")
                                        </form>
                                        <button type="button" onclick="document.getElementById('deleteUserForm{{$user->id}}').submit()" class="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr><th>Email</th><th>Name</th><th>Price Plan</th><th>Actions</th></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
