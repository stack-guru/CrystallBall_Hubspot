@extends('layouts.admin')
@section('page-title','Open Weather Map Push Notification')
@section('content')

<div class="container">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-10 p-5">
            <h1 class="my-4 ">Open Weather Map Push Notification</h1>
            
            <h4><strong></strong> {{ $oWMPushNotification->owm_alert_id }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->shape }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->location_coordinates }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->alert_type }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->categories }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->urgency }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->severity }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->certainity }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->alert_date }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->sender_name }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->event }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->headline }}</h4>
            <h4><strong></strong> {{ $oWMPushNotification->description }}</h4>
        </div>
    </div>

</div>

@endsection