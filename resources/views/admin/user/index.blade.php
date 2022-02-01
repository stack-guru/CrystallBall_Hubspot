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
                    <span class="badge badge-success">Total Registration is last 6 months: {{ $last6_months_registration_count }}</span>
                    <span class="badge badge-success">% Of Active users in last 6 months: <span id="percent-of-active-users-in-6-months"></span></span>
                    <span class="badge badge-success">Active users in the last 90 days: <span id="active-users-in-90-days"></span></span>

                    <span class="badge badge-warning float-right">Total Users: {{count($users)}}</span>
                </div>
                <div class="card-body">
                    {{-- <div class="container mt-2 mb-4 pl-5">
                        <span class="badge badge-warning">Total Users: {{count($users)}}</span>
                    </div> --}}
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
                                @php
                                    $last90DaysActiveUsers = 0;
                                    $last6MonthsActiveUsers = 0;
                                @endphp
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
                                    @if($user->last90_days_popup_opened_chrome_extension_logs_count
                                        || $user->last90_days_annotation_button_clicked_chrome_extension_logs_count
                                        || $user->last90_days_api_annotation_created_logs_count
                                        || $user->last90_days_notification_logs_count
                                        || @$user->pricePlan->price
                                        || $user->last90_days_login_logs_count)
                                        @php
                                            $last90DaysActiveUsers++;
                                            $last6MonthsActiveUsers++;
                                        @endphp
                                    @endif
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

    const last6MonthsRegistrationCount = ({{ $last6MonthsActiveUsers }} / {{ $last6_months_registration_count }}) * 100;
    const last90DaysActiveUsers = {{ $last90DaysActiveUsers }};
    
    document.getElementById('percent-of-active-users-in-6-months').replaceWith(last6MonthsRegistrationCount);

    document.getElementById('active-users-in-90-days').replaceWith(last90DaysActiveUsers);
</script>   
@endsection