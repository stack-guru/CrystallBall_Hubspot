@extends('layouts.admin')
@section('page-title','OWM Push Notifications')
@section('content')
    <div class="container">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>OWM Push Notifications</h2>
                     <table aria-label="Open Weather Map Push Notifications" class="table table-hover table-responsive-md table-striped mt-5">
                         <thead>
                         <tr>
                             <th scope="col">ID</th>
                             <th scope="col">Shape</th>
                             <th scope="col">Event Name</th>
                             <th scope="col">Alert type</th>
                             <th scope="col">Urgency</th>
                             <th scope="col">Severity</th>
                             <th scope="col">Certainty</th>
                             <th scope="col">Actions</th>

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
                                     <form action="{{route('admin.data-source.o-w-m-push-notification.destroy',$oWMPushNotification->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
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
