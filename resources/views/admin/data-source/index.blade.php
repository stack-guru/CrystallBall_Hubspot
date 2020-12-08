@extends('layouts.admin')
@section('page-title','Data Sources')
@section('content')
    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <div class="row ml-0 mr-0">
                    <div class="col-12">
                        <h1>Data Source</h1>
                    </div>
                </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 col-lg-8">
                        <h2>Holiday</h2>

                        <div class="row ml-0 mr-0 mt-4">
                            <div class="col-12">
                                <a href="{{route('admin.data-source.holiday.index')}}" class="btn btn-primary">View All</a>
                                <a href="{{route('admin.data-source.holiday.create')}}" class="btn btn-primary">Add New</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 col-lg-8">
                        <h2>Retail marketing</h2>

                        <div class="row ml-0 mr-0 mt-4">
                            <div class="col-12">
                                <a href="{{route('admin.data-source.retail-marketing.index')}}" class="btn btn-primary">View All</a>
                                <a href="{{route('admin.data-source.retail-marketing.create')}}" class="btn btn-primary">Add New</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row ml-0 mr-0 mt-5">
                    <div class="col-12 col-lg-8">
                        <h2>Google Algorithm Updates</h2>

                        <div class="row ml-0 mr-0 mt-4">
                            <div class="col-12">
                                <a href="{{route('admin.data-source.google-algorithm-update.index')}}" class="btn btn-primary">View All</a>
                                <a href="{{route('admin.data-source.google-algorithm-update.create')}}" class="btn btn-primary">Add New</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
