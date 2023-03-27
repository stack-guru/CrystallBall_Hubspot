@extends('layouts/spectator')
@section('page-title','Plan Notification')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css" />
@endsection

@section('content')
<div class="container-fluid">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Plan Notification</div>
                <div class="card-body">
                    <table aria-label="Payment History" class="table table-hover table-bordered " id="myTable">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">User email</th>
                                <th scope="col">Notification Type</th>
                                <th scope="col">Notification</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($planNotifications as $planNotification)
                            <tr>
                                <td>{{@$planNotification->user->name}} </td>
                                <td>{{@$planNotification->user->email}}</td>
                                <td>{{$planNotification->type}}</td>
                                <td>{{$planNotification->text}}</td>
                                <td>{{$planNotification->created_at->todateString()}}</td>
                                <td>
                                    <form action="{{route('spectator.plan-notifications.destroy',$planNotification->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"  class="btn btn-danger m-2">Delete</button>

                                    </form>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="alert-danger">No record Found</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
<script>
    $(document).ready(function() {
        $('#myTable').DataTable({
            order: [
                [6, 'desc']
            ],
            dom: 'Bfrtip',
            buttons: [
                'csv'
            ],
            "paging": true
        });
    });
</script>
@endsection