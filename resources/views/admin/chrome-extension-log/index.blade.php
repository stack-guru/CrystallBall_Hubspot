@extends('layouts.admin')
@section('page-title','Chrome Extension Log')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css"/>
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Chrome Extension Log for User: {{ $user->name }}
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table aria-label="Chrome Extension Logs" class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th scope="col">Event Name</th>
                                    <th scope="col">IP Address</th>
                                    <th scope="col">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($chromeExtensionLogs as $chromeExtensionLog)
                                    <tr>
                                        <td>{{ $chromeExtensionLog->event_name }}</td>
                                        <td>{{ $chromeExtensionLog->ip_address }}</td>
                                        <td>{{ $chromeExtensionLog->created_at }}</td>
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