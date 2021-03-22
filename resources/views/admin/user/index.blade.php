@extends('layouts.admin')
@section('page-title','Users')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Users</div>
                <div class="card-body">
                    <div class="container mt-2 mb-4 pl-5">
                        <span class="badge badge-warning">Total Users: {{count($users)}}</span>
                    </div>
                    <table class="table table-hoved table-bordered">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Price Plan</th>
                                <th>Registration Date</th>
                                <th>User's last added annotation</th>
                                <th>Data Sources</th>
                                <th>API</th>
                                <th>Total Logins</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->team_name }}{{ $user->department ? ", " . $user->department : ''}}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->pricePlan->name }}</td>
                                    <td>@if($user->created_at){{ $user->created_at->format('Y-m-d') }}@endif</td>
                                    <td>@if($user->lastAnnotation) @if($user->lastAnnotation->updated_at){{ $user->lastAnnotation->updated_at->format('Y-m-d') }}@endif @endif</td>
                                    <td>
                                        @if($user->is_ds_holidays_enabled) Holiday<br /> @endif
                                        @if($user->is_ds_google_algorithm_updates_enabled) Google Algorithm Updates<br /> @endif
                                        @if($user->is_ds_retail_marketing_enabled) Retail Marketing enabled<br /> @endif
                                        @if($user->is_ds_weather_alerts_enabled) Weather Alerts enabled<br /> @endif
                                    </td>
                                    <td>
                                        @if($user->last_generated_api_token_at) Token on:{{$user->last_generated_api_token_at->format('Y-m-d')}}<br /> @endif
                                        @if($user->last_api_called_at) Call on:{{$user->last_api_called_at->format('Y-m-d')}}<br /> @endif
                                    </td>
                                    <td>{{ $user->login_logs_count }}</td>
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
                            <tr>
                                <th>Team</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Price Plan</th>
                                <th>Registration Date</th>
                                <th>User's last added annotation</th>
                                <th>Actions</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
