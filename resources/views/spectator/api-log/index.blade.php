@extends('layouts.spectator')
@section('page-title','Api Log')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css" />
@endsection

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Api Log for User: {{ $user->name }}
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table aria-label="API Log" class="table table-hoved table-bordered" id="myTable">
                            <thead>
                                <tr>
                                    <th scope="col">Event Name</th>
                                    <th scope="col">IP Address</th>
                                    <th scope="col">Login At</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($apiLogs as $apiLog)
                                <tr>
                                    <td>{{ $apiLog->event_name }}</td>
                                    <td>{{ $apiLog->ip_address }}</td>
                                    <td>{{ $apiLog->created_at }}</td>
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