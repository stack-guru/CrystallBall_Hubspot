@extends('layouts.admin')
@section('page-title','Checklist Items')
@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 p-5">
                <div class="card">
                    <div class="card-header">Checklist Items</div>
                    <div class="card-body">
                        <div class="row ml-0 mr-0">
                            <div class="col-12 text-right">
                                <a href="{{route('admin.checklist-item.create')}}" class="btn btn-primary my-3">Add Checklist Item</a>

                            </div>
                        </div>
                        <table class="table table-hoved table-bordered">
                            <thead>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Label</th>
                                <th>Description</th>
                                <th>URL</th>
                                <th>Sort Rank</th>
                                <th>Actions</th>
                            </thead>
                            <tbody>
                            @forelse($checklistItems as $checklistItem)
                                <tr>
                                    <td>{{$checklistItem->id}}</td>
                                    <td>{{$checklistItem->name}}</td>
                                    <td>{{$checklistItem->label}}</td>
                                    <td>{{$checklistItem->description}}</td>
                                    <td>{{$checklistItem->url}}</td>
                                    <td>{{$checklistItem->sort_rank}}</td>
                                    <td class="d-flex flex-row">
                                        <a href="{{route('admin.checklist-item.edit',$checklistItem->id)}}" class="btn btn-primary m-2">Edit</a>
                                        <form action="{{route('admin.checklist-item.destroy',$checklistItem->id)}}" method="post" onsubmit="event.preventDefault(); if(confirm('Do you really want to delete this entity?')) this.submit();">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"  class="btn btn-danger m-2">Delete</button>

                                        </form>

                                    </td>

                                </tr>
                            @empty
                                <tr><td colspan="7" class="text-center alert-danger">Checklist Items not found</td></tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @endsection
