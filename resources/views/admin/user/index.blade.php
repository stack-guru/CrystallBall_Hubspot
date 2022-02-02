@extends('layouts.admin')
@section('page-title','Users')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css"/>
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <span class="badge badge-warning float-right">Total Users: {{count($users)}}</span>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Plan (Ending)</th>
                                    <th>Registration Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($users as $user)
                                    <tr>
                                        <td>{{ $user->team_name }}{{ $user->department ? ", " . $user->department : ''}}</td>
                                        <td>{{ $user->email }}</td>
                                        <td>{{ $user->name }}</td>
                                        <td>{{ $user->pricePlan->name }} ({{ $user->price_plan_expiry_date }})</td>
                                        <td>@if($user->created_at){{ $user->created_at->format('Y-m-d') }}@endif</td>
                                        <td>
                                            <div class="row ml-0 mr-0 d-flex flex-row ">
                                            <a class="btn btn-primary m-2" href="{{ route('admin.user.edit', $user->id) }}">Edit</a>
                                            <form id="deleteUserForm{{$user->id}}" method="POST" action="{{ route('admin.user.destroy', $user->id) }}">
                                                @csrf @method("DELETE")
                                            </form>
                                            <button type="button" onclick="document.getElementById('deleteUserForm{{$user->id}}').submit()" class="btn btn-danger m-2">Delete</button>

                                            <form id="loginUserForm{{$user->id}}" method="POST" action="{{ route('admin.user.login', $user->id) }}">
                                                @csrf
                                            </form>
                                            <button type="button" onclick="document.getElementById('loginUserForm{{$user->id}}').submit()" class="btn btn-secondary m-2">Impersonate</button>
                                            
                                            <form id="makeOwnerUserForm{{$user->id}}" method="POST" action="{{ route('admin.user.make-owner', $user->id) }}">
                                                @csrf @method("PUT")
                                            </form>
                                            <button type="button" onclick="document.getElementById('makeOwnerUserForm{{$user->id}}').submit()" class="btn btn-secondary m-2">Make Owner</button>

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