@extends('layouts.admin')
@section('page-title','Retail Marketing')
@section('content')
    <div class="container">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <div class="row ml-0 mr-0">
                    <div class="col-12">
                        <h1>Data Source</h1>
                        <div class="text-right">
                            <a href="{{route('admin.data-source.retail-marketing.create')}}" class="btn btn-primary">Add New</a>
                        </div>
                    </div>
                </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>Retail Marketing</h2>
                        <table class="table table-hover table-responsive-md table-striped mt-5">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Category</th>
                                <th scope="col">Event Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Url</th>
                                <th scope="col">Show at</th>
                                <th scope="col">Actions</th>

                            </tr>
                            </thead>
                            <tbody>
                            @forelse($rms as $rm)
                                <tr>

                                    <td>{{$rm->id}}</td>
                                    <td>{{$rm->category}}</td>
                                    <td>{{$rm->event_name}}</td>
                                    <td>{{$rm->description}}</td>
                                    <td>{{$rm->url}}</td>
                                    <td>{{$rm->show_at}}</td>
                                    <td>
                                        <div class="d-flex flex-row text-center">
                                            <a href="{{route('admin.data-source.retail-marketing.edit',$rm->id)}}" class="btn btn-primary mx-2 btn-sm ">Edit</a>
                                            <form action="{{route('admin.data-source.retail-marketing.destroy',$rm->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
                                                @csrf
                                                @method('DELETE')
                                                <button class="btn btn-primary btn-sm mx-2">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="alert-danger">No record found</td>
                                </tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>

@endsection
