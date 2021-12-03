@extends('layouts.admin')
@section('page-title','User Activity')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css" />
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">User Activity</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Added Properties</th>
                                    <th>Any Annotation by property</th>
                                    <th>Is Google Analytics/Search Console Connected</th>
                                    <th>Has Data Studio connected?</th>
                                    <th>Manual Annotations Count</th>
                                    <th>Total Annotations</th>
                                    <th>Last Annotation added at</th>
                                    <th>Data Sources</th>
                                    <th>API</th>
                                    <th>Total Logins</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->google_analytics_properties_count }}</td>
                                    <td>Working on it</td>
                                    <td>
                                        @foreach($user->googleAccounts as $googleAccount)
                                        {{ $googleAccount->name}}
                                        ( @if($googleAccount->hasSearchConsoleScope()) Search Console @endif)
                                        ( @if($googleAccount->hasGoogleAnalyticsScope()) Google Analytics @endif)
                                        <br />
                                        @endforeach
                                    </td>
                                    <td>@if(is_null($user->last_data_studio_used_at))No @else Yes @endif</td>
                                    <td>{{ $user->manual_annotations_count }}</td>
                                    <td>Working on it</td>
                                    <td>{{ @$user->last_annotation->created_at }}</td>
                                    <td>
                                        @if($user->is_ds_holidays_enabled) Holiday<br /> @endif
                                        @if($user->is_ds_google_algorithm_updates_enabled) Google Algorithm Updates<br /> @endif
                                        @if($user->is_ds_retail_marketing_enabled) Retail Marketing enabled<br /> @endif
                                        @if($user->is_ds_weather_alerts_enabled) Weather Alerts enabled<br /> @endif
                                        @if($user->is_ds_google_alerts_enabled) Google Alerts enabled<br /> @endif
                                        @if($user->is_ds_web_monitors_enabled) Web Monitors enabled<br /> @endif
                                    </td>
                                    <td>
                                        @if($user->last_generated_api_token_at) Token on:{{$user->last_generated_api_token_at->format('Y-m-d')}}<br /> @endif
                                        @if($user->last_api_called_at) Call on:{{$user->last_api_called_at->format('Y-m-d')}}<br /> @endif
                                    </td>
                                    <td>{{ $user->login_logs_count }}</td>
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
    $(document).ready(function() {
        $('#myTable').DataTable();
    });
</script>
@endsection