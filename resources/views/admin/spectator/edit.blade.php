@extends('layouts.admin')

@section('page-title','Edit Spectator')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form method="POST" action="{{ route('admin.spectator.update', $spectator->id) }}">
            <div class="card">
                <div class="card-header">Create Spectator</div>

                <div class="card-body">
                        @csrf @method('PUT')
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  class="form-control" type="text" name="name" id="name" value="{{ $spectator->name }}" >
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
                        <input type="submit" value="Save" class="btn btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
