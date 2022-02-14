@extends('layouts.spectator')
@section('page-title','Dashboard')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    <span class="badge badge-success">Total Registration is last 6 months: {{ $last6_months_registration_count }}</span>
                    <span class="badge badge-success">% Of Active users in last 6 months: {{ $percent_of_active_users_in_6_months }}</span>
                    <span class="badge badge-success">Active users in the last 90 days: {{ $active_users_in_90_days }}</span>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection