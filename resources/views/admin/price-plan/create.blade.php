@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Create Price Plan</div>

                <div class="card-body">
                    <form action="{{ route('admin.price-plan.store') }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" id="name" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" name="price" id="price" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Number of annotations</label>
                            <input type="number" name="annotations_count" id="annotationsCount" class="form-control" value="0" />
                        </div>
                        <div class="form-group">
                            <label>Has manual add?</label>
                            <input type="checkbox" name="has_manual_add" id="hasManualAdd" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has CSV upload?</label>
                            <input type="checkbox" name="has_csv_upload" id="hasCSVUpload" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has API?</label>
                            <input type="checkbox" name="has_api" id="hasAPI" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Enabled?</label>
                            <input type="checkbox" name="is_enabled" id="isEnabled" class="form-control" />
                        </div>
                        <input type="submit" value="Add" class="btn btn-primary" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
