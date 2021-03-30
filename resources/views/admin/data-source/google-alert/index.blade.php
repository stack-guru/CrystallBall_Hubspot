@extends('layouts.admin')
@section('page-title','Google Alert')
@section('content')
    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                    <div class="row ml-0 mr-0">
                        <div class="col-12">
                            <h1>Data Source</h1>
                            {{-- <div class="text-right">
                                <a href="{{route('admin.data-source.google-alert.create')}}" class="btn btn-primary">Add New</a>
                            </div> --}}
                        </div>
                    </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 d-flex flex-column justify-content-center">
                        <h2>Google Alert</h2>
                        <div class="table-responsive">
                     <table class="table table-hover table-responsive-md table-striped mt-5">
                         <thead>
                         <tr>
                             <th>Image</th>
                             <th>Category</th>
                             <th>Title</th>
                             <th>Description</th>
                             <th>URL</th>
                             <th>Actions</th>

                         </tr>
                         </thead>
                         <tbody>
                         @forelse($googleAlerts as $googleAlert)
                         <tr>

                             <td>
                                @if($googleAlert->image)
                                    <a href="{{$googleAlert->image}}">
                                        <img src="{{ $googleAlert->image}}" alt="" width="100px" height="auto">
                                    </a>
                                @endif
                            </td>
                             <td>{{$googleAlert->category}}</td>
                             <td>{{$googleAlert->title}}</td>
                             <td>{{$googleAlert->description}}</td>
                             <td>
                                <a href="{{$googleAlert->url}}">Open Link</a>
                            </td>
                             <td>
                                 <div class="d-flex flex-row text-center">
                                     <form action="{{route('admin.data-source.google-alert.destroy',$googleAlert->id)}}" method="post">
                                         @csrf
                                         @method('DELETE')
                                         <button class="btn btn-primary btn-sm mx-2">Delete</button>
                                     </form>
                                 </div>
                             </td>
                         </tr>
                         @empty
                             <tr>
                                 <td colspan="6" class="alert-danger">No record found</td>
                             </tr>
                         @endforelse
                         </tbody>
                     </table>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

@endsection
