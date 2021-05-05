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
                <div class="card-header">Users
                    <span class="badge badge-warning float-right">Total Web Monitors: {{count($webMonitors)}}</span>
                    <span class="badge badge-success float-right mr-3">Total Active Web Monitors: {{$activeWebMonitorsCount}}</span>
                </div>
                <div class="card-body">
                    {{-- <div class="container mt-2 mb-4 pl-5">
                        <span class="badge badge-warning">Total Users: {{count($users)}}</span>
                    </div> --}}
                    <div class="table-responsive">
                        <table class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>URL</th>
                                    <th>Uptime Robot ID</th>
                                    <th>Last Status</th>
                                    <th>Last Synced At</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($webMonitors as $webMonitor)
                                    <tr>
                                        <td>{{ $webMonitor->id }}</td>
                                        <td>{{ $webMonitor->name }}</td>
                                        <td>{{ $webMonitor->url }}</td>
                                        <td>{{ $webMonitor->uptime_robot_id }}</td>
                                        <td>{{ $webMonitor->last_status }}</td>
                                        <td>{{ $webMonitor->last_synced_at }}</td>
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