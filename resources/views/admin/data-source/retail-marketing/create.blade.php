@extends('layouts.admin')
@section('page-title','Create Retail Marketings')
@section('content')

    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <h1 class="my-4 ">Create R M</h1>

                <div class="row ml-0 mr-0 mt-5">
                    <div class="col">
                        <form action="{{ route('admin.data-source.retail-marketing.upload') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="form-group">
                                <h4 ><b>Upload Csv</b></h4>
                                <input type="file" name="csv" id="retail-marketing" class="form-control">
                            </div>
                            <div class="row ml-0 mr-0">
                                <div class="col-12 text-right">
                                    <button type="submit" class="btn btn-primary">Upload</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="text-center">
                    <span class="lead"><b>OR</b></span>
                </div>
                <div class="row ml-0 mr-0">
                    <div class="col">
                        <h4><b>Create manually</b></h4>
                        <form action="{{route('admin.data-source.retail-marketing.store')}}" method="post">
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
                                <textarea  name="description" id="description" class="form-control" rows="5" ></textarea>
                                @error('description')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">Url</label>
                                <input type="text"  name="url" id="url" class="form-control"  />
                                @error('url')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">Show At</label>
                                <input type="date"  name="show_at" id="show_at" class="form-control"  />
                                @error('show_at')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="row ml-0 mr-0">
                            <div class="col-12 text-right">
                                <button type="submit" class="btn btn-primary">save</button>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endsection
