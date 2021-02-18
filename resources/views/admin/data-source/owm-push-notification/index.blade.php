@extends('layouts.admin')
@section('page-title','OWM Push Notifications')
@section('content')
    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>OWM Push Notifications</h2>
                     <table class="table table-hover table-responsive-md table-striped mt-5">
                         <thead>
                         <tr>
                             <th>ID</th>
                             <th>Shape</th>
                             <th>Event Name</th>
                             <th>Alert type</th>
                             <th>Urgency</th>
                             <th>Severity</th>
                             <th>Certainty</th>
                             <th>Actions</th>

                         </tr>
                         </thead>
                         <tbody>
                         @forelse($oWMPushNotifications as $oWMPushNotification)
                         <tr>

                             <td>{{$oWMPushNotification->id}}</td>
                             <td>{{$oWMPushNotification->shape}}</td>
                             <td>{{$oWMPushNotification->event}}</td>
                             <td>{{$oWMPushNotification->alert_type}}</td>
                             <td>{{$oWMPushNotification->urgency}}</td>
                             <td>{{$oWMPushNotification->severity}}</td>
                             <td>{{$oWMPushNotification->certainty}}</td>
                             <td>
                                 <div class="d-flex flex-row text-center">
                                     <a href="{{route('admin.data-source.o-w-m-push-notification.show',$oWMPushNotification->id)}}" class="btn btn-primary mx-2 btn-sm ">Show</a>
                                     <form action="{{route('admin.data-source.o-w-m-push-notification.destroy',$oWMPushNotification->id)}}" method="post">
                                         @csrf
                                         @method('DELETE')
                                         <button class="btn btn-primary btn-sm mx-2">Delete</button>
                                     </form>
                                 </div>
                             </td>
                         </tr>
                         @empty
                             <tr>
                                 <td colspan="8" class="alert-danger">No record found</td>
                             </tr>
                         @endforelse
                         </tbody>
                     </table>
                     {{ $oWMPushNotifications->links() }}
                    </div>
                </div>

            </div>
        </div>
    </div>

@endsection
