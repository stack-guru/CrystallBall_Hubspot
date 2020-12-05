@extends('layouts.admin')
@section('page-title','Edit GAU')
@section('content')

<div class="contianer">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-10 p-5">
            <h1 class="my-4 ">Edit G A U</h1>

            <form action="{{route('admin.data-source.google-algorithm-update.update', $googleAlgorithmUpdate->id)}}" method="post">
                @csrf @method('PATCH')
                <div class="form-group">
                    <label for="">Category</label>
                    <input type="text" name="category" id="category" class="form-control" value="{{ $googleAlgorithmUpdate->category }}">
                    @error('category')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="event_name">Event name</label>
                    <input type="text" name="event_name" id="event_name" class="form-control" value="{{ $googleAlgorithmUpdate->event_name }}">
                    @error('event_name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="">Description</label>
                    <textarea name="description" id="description" class="form-control" rows="5">{{ $googleAlgorithmUpdate->description }}</textarea>
                    @error('description')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="">Update Date</label>
                    <input type="date" name="update_date" id="updateDate" value="{{ $googleAlgorithmUpdate->update_date->format('Y-m-d') }}"
                        class="form-control">
                    @error('update_date')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
                <div class="row ml-0 mr-0">
                    <div class="col-12 text-right">
                        <button class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

</div>
</div>
</div>
@endsection