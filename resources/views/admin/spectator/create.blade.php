@extends('layouts.admin')

@section('page-title','Create Spectator')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form method="POST" action="{{ route('admin.spectator.store') }}">
            <div class="card">
                <div class="card-header">Create Spectator</div>

                <div class="card-body">
                        @csrf
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  class="form-control" type="text" name="name" id="name" value="" >
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input  class="form-control" type="email" name="email" id="email" value="" >
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input  class="form-control" type="password" name="password" id="password" value="" >
                        </div>
                        <div class="form-group">
                            <label for="password_confirmation">Password Confirmation</label>
                            <input  class="form-control" type="password" name="password_confirmation" id="password_confirmation" value="" >
                        </div>
                        
                    </div>
                    <div class="card-footer">
                        <input type="submit" value="Create" class="btn btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
