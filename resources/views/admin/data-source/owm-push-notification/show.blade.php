@extends('layouts.admin')
@section('page-title','Open Weather Map Push Notification')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-10 p-5">
            <h1 class="my-4 ">Open Weather Map Push Notification</h1>

            @foreach($oWMPushNotification as $key => $value)
                <h4><strong>{{$key}}</strong> {{ $value }}</h4>
            @endforeach
        </div>
    </div>

</div>

@endsection