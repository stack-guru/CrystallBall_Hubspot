@extends('layouts.admin')
@section('page-title','Active Users - Reports')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css"/>
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Users</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Registration Date</th>
                                    <th>Login to the platform</th>
                                    <th>open the extension in last 30 days</th>
                                    <th>click on a red dot on chart</th>
                                    <th>added an annotation via API</th>
                                    <th>gets an email from Notifications feature</th>
                                    <th>is on Basic or Pro</th>
                                    <th>Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                @php
                                    $totalActiveUsers = 0;
                                    $newUsersInLast30Days = 0;
                                @endphp
                                @foreach($users as $user)
                                    @if(\Carbon\Carbon::now()->subDays(30) >= $user->created_at )
                                        @php
                                            $newUsersInLast30Days++;
                                        @endphp
                                    @endif
                                    <tr>
                                        <td>{{ $user->name }}</td>
                                        <td>{{ $user->email }}</td>
                                        <td>{{ $user->created_at }}</td>
                                        <td>{{ $user->last_login_at }} + {{ $user->login_logs_count }}</td>
                                        <td>{{ $user->lastPopupOpenedChromeExtensionLog->created_at ?? '' }} + {{ $user->last30_days_popup_opened_chrome_extension_logs_count }}</td>
                                        <td>{{ $user->lastAnnotationButtonClickedChromeExtensionLog->created_at ?? '' }} + {{ $user->annotation_button_clicked_chrome_extension_logs_count }}</td>
                                        <td>{{ $user->last_api_called_at }} + {{ $user->last30_days_api_annotation_created_logs_count }}</td>
                                        <td></td>
                                        <td>{{ $user->pricePlan->name }}</td>
                                        <td>
                                            @if($user->last30_days_popup_opened_chrome_extension_logs_count
                                                || $user->annotation_button_clicked_chrome_extension_logs_count
                                                || $user->last30_days_api_annotation_created_logs_count
                                                || $user->pricePlan->price
                                                || $user->login_logs_count)
                                                @php
                                                    $totalActiveUsers++;
                                                @endphp
                                                Yes
                                            @else
                                                @php

                                                @endphp
                                                No
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="badge badge-warning float-right">Total Active Users in Last 30 days: {{ $totalActiveUsers }}</span>
                    <span class="badge badge-warning float-right">Number of registrations in Last 30 days: {{ $newUsersInLast30Days }}</span>
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