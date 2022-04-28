@extends('layouts.admin')
@section('page-title','Wordpress Update')
@section('content')
    <div class="container">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                    <div class="row ml-0 mr-0">
                        <div class="col-12">
                            <h1>Data Source</h1>
                            <div class="text-right">
                                <a href="{{route('admin.data-source.wordpress-update.create')}}" class="btn btn-primary">Add New</a>
                            </div>
                        </div>
                    </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>Wordpress Update</h2>
                     <table class="table table-hover table-responsive-md table-striped mt-5">
                         <thead>
                         <tr>
                             <th>ID</th>
                             <th>Category</th>
                             <th>Event Name</th>
                             <th>Description</th>
                             <th>Update Date</th>
                             <th>Status</th>
                             <th>Actions</th>

                         </tr>
                         </thead>
                         <tbody>
                         @forelse($wordpressUpdates as $wordpressUpdate)
                         <tr>

                             <td>{{$wordpressUpdate->id}}</td>
                             <td>{{$wordpressUpdate->category}}</td>
                             <td>{{$wordpressUpdate->event_name}}</td>
                             <td>{{$wordpressUpdate->description}}</td>
                             <td>{{$wordpressUpdate->update_date}}</td>
                             <td>{{$wordpressUpdate->status}}</td>
                             <td>
                                 <div class="d-flex flex-row text-center">
                                     <a href="{{route('admin.data-source.wordpress-update.edit',$wordpressUpdate->id)}}" class="btn btn-primary mx-2 btn-sm ">Edit</a>
                                     <form action="{{route('admin.data-source.wordpress-update.destroy',$wordpressUpdate->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
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
