@extends('layouts.admin')
@section('page-title','Add Google Update')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-10 p-5">
            <h1 class="my-4 ">Add Google Update</h1>
            <form action="{{ route('admin.data-source.google-algorithm-update.upload') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="form-group">
                    <h4 ><b>Upload CSV</b></h4>
                    <input type="file" name="csv" id="googleAU" class="form-control">
                </div>
                <div class="row ml-0 mr-0">
                    <div class="col-12 text-right">
                        <button type="submit" class="btn btn-primary">Upload</button>
                    </div>
                </div>
            </form>
            <form action="{{route('admin.data-source.google-algorithm-update.store')}}" method="post">
                @csrf
                <div class="form-group">
                    <label for="">Category</label>
                    <input type="text" name="category" id="category" class="form-control">
                    @error('category')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="event_name">Event name</label>
                    <input type="text" name="event_name" id="event_name" class="form-control">
                    @error('event_name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="">Description</label>
                    <textarea name="description" id="description" class="form-control" rows="5"></textarea>
                    @error('description')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="">Update Date</label>
                    <input type="date" name="update_date" id="updateDate"
                        class="form-control">
                    @error('update_date')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
                
                <div class="form-group">
                    <label for="">URL</label>
                    <input type="text" name="url" id="url"
                        class="form-control">
                    @error('url')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="">Is Confirmed?</label>
                    <input type="checkbox" name="is_confirmed" id="isConfirmed"
                        class="form-control">
                    @error('is_confirmed')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="row ml-0 mr-0">
                    <div class="col-12 text-right">
                        <button class="btn btn-primary">Add</button>
                    </div>
                </div>
            </form>
        </div>w
    </div>

</div>

@endsection