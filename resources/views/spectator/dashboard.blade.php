@extends('layouts.spectator')
@section('page-title','Dashboard')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    <h1>Hi, {{ \Illuminate\Support\Facades\Auth::user()->name }}!</h1>
                    <p>How are you doing today?</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection