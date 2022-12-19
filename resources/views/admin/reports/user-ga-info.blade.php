@extends('layouts.admin')
@section('page-title', 'Active Users - Reports')

@section('css')
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css" />
@endsection


@section('content')

<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Users</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table id="myTable" className="table table-hover gaa-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Analytics Accounts</th>
                                    <th>Properties &amp; Apps</th>
                                    <th>Google Account</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($googleAnalyticsProperties as $googleAnalyticsProperty)
                                    <tr>
                                        <td>{{ $googleAnalyticsProperty->googleAnalyticsAccount->name ?? '' }}</td>
                                        <td>
                                            {{ $googleAnalyticsProperty->name }}&nbsp;&nbsp;&nbsp;
                                            @if ($googleAnalyticsProperty->is_in_use)
                                                <span className="badge badge-pill badge-success">In use</span>
                                            @endif
                                        </td>
                                        <td>{{ $googleAnalyticsProperty->googleAccount->name ?? '' }}</td>
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
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#myTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'csv'
                ],
                "paging": true
            });
        });
    </script>
@endsection
