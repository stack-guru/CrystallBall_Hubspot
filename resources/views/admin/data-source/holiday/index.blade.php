@extends('layouts.admin')
@section('page-title','Payment History')
@section('content')
    <div class="container">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                    <div class="row ml-0 mr-0">
                        <div class="col-12">
                            <h1>Data Source</h1>
                            <div class="text-right">
                                <a href="{{route('admin.data-source.holiday.create')}}" class="btn btn-primary">Add New</a>
                            </div>
                        </div>
                    </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>Holiday</h2>
                     <table class="table table-hover table-responsive-md table-striped mt-5">
                         <thead>
                         <tr>
                             <th>ID</th>
                             <th>Category</th>
                             <th>Event Name</th>
                             <th>Description</th>
                             <th>Country Name</th>
                             <th>Holiday Date</th>
                             <th>Actions</th>

                         </tr>
                         </thead>
                         <tbody>
                         @forelse($holidays as $holiday)
                         <tr>

                             <td>{{$holiday->id}}</td>
                             <td>{{$holiday->category}}</td>
                             <td>{{$holiday->event_name}}</td>
                             <td>{{$holiday->description}}</td>
                             <td>{{$holiday->country_name}}</td>
                             <td>{{$holiday->holiday_date}}</td>
                             <td>
                                 <div class="d-flex flex-row text-center">
                                     <a href="{{route('admin.data-source.holiday.edit',$holiday->id)}}" class="btn btn-primary mx-2 btn-sm ">Edit</a>
                                     <form action="{{route('admin.data-source.holiday.destroy',$holiday->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
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
