@extends('layouts.admin')
@section('page-title','Create Retail Marketings')
@section('content')

    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">


                <div class="row ml-0 mr-0">
                    <div class="col">
                        <h4><b>Edit R M</b></h4>
                        <form action="{{route('admin.data-source.retail-marketing.update',$RetailMarketing->id)}}" method="post">
                            @csrf
                            @method('PUT')
                            <div class="form-group">
                                <label for="">Category</label>
                                <input type="text" name="category" value="{{old('category',$RetailMarketing->category)}}" id="category" class="form-control">
                                @error('category')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="event_name">Event name</label>
                                <input type="text" name="event_name" value="{{old('event_name',$RetailMarketing->event_name)}}" id="event_name" class="form-control">
                                @error('event_name')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="">Description</label>
                                <textarea  name="description" id="description" class="form-control" rows="5" >{{old('description',$RetailMarketing->description)}}</textarea>
                                @error('description')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">Url</label>
                                <input type="text" value="{{old('url',$RetailMarketing->url)}}" name="url" id="url" class="form-control"  />
                                @error('url')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">Show At</label>
                                <input type="date"  name="show_at" value="{{$RetailMarketing->show_at}}" id="show_at" class="form-control"  />
                                @error('show_at')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="row ml-0 mr-0">
                                <div class="col-12 text-right">
                                    <button type="submit" class="btn btn-primary">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
