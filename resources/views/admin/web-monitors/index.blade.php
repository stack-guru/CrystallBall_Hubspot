@extends('layouts.admin')
@section('page-title', 'Users')

@section('css')
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.24/datatables.min.css" />
@endsection

@section('content')
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">Users
            <span class="badge badge-warning float-right">Total Web Monitors: {{ count($webMonitors) }}</span>
            <span class="badge badge-success float-right mr-3">Total Active Web Monitors:
              {{ $activeWebMonitorsCount }}</span>
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
                    <th>Email</th>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Uptime Robot ID</th>
                    <th>Last Status</th>
                    <th>Last Synced At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  @foreach ($webMonitors as $webMonitor)
                    <tr>
                      <td>{{ $webMonitor->id }}</td>
                      <td>{{ $webMonitor->email_address ?? $webMonitor->user->email }}</td>
                      <td>{{ $webMonitor->name }}</td>
                      <td>{{ $webMonitor->url }}</td>
                      <td>{{ $webMonitor->uptime_robot_id }}</td>
                      <td>

                        @if($webMonitor->last_synced_at)
                            ({{ $webMonitor->last_status }})
                        @endif

                        @if ($webMonitor->last_status == 0 && $webMonitor->last_synced_at)
                          @lang('Monitor Paused')
                        @elseif ($webMonitor->last_status == 1)
                          @lang('Monitor Started')
                        @elseif ($webMonitor->last_status == 2)
                          @lang('Site Down')
                        @elseif ($webMonitor->last_status == 9)
                          @lang('Monitor Started')
                        @else
                          @lang('Not Synced')
                        @endif

                      </td>
                      <td>
                        {{ $webMonitor->last_synced_at ? $webMonitor->last_synced_at->format(config('app.format.datetime')) : 'Not Synced' }}
                      </td>
                      <td>
                        <form id="deleteUptimeRobotForm{{ $webMonitor->id }}" method="POST"
                          action="{{ route('admin.web-monitor.destroy', $webMonitor->id) }}">
                          {{ csrf_field() }}
                          {{ method_field('DELETE') }}
                        </form>
                        <button type="button"
                          onclick="if(confirm('Do you really want to delete this entity?')) document.getElementById('deleteUptimeRobotForm{{ $webMonitor->id }}').submit();"
                          class="btn btn-danger m-2">Delete</button>
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
    $(document).ready(function() {
      $('#myTable').DataTable();
    });
  </script>
@endsection
