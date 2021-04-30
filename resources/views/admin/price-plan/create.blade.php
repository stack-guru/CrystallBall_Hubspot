@extends('layouts.admin')
@section('page-title','Add Price Plan')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form action="{{ route('admin.price-plan.store') }}" method="POST">
            <div class="card">
                <div class="card-header">Create Price Plan</div>

                <div class="card-body">
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
                        <label>Short Description</label>
                        <input type="text" name="short_description" id="short_description" class="form-control"  />
                    </div>
                        <div class="form-group">
                            <label>Number of annotations</label>
                            <input type="number" name="annotations_count" id="annotationsCount" class="form-control" value="0" />
                        </div>
                    <div class="form-group">
                        <label>Ga Account Count</label>
                        <input type="number" name="ga_account_count" id="ga_account_count" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label>User per ga-account count?</label>
                        <input type="number" name="user_per_ga_account_count" id="user_per_ga_account_count" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label>Web monitor count?</label>
                        <input type="number" name="web_monitor_count" id="web_monitor_count" class="form-control" />
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
                        <label>Has Integrations?</label>
                        <input type="checkbox" name="has_integrations" id="hasIntegrations" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label>Has Data Sources?</label>
                        <input type="checkbox" name="has_data_sources" id="hasDataSources" class="form-control" />
                    </div>

                    <div class="form-group">
                        <label>Available?</label>
                        <input type="checkbox" name="is_available" id="isAvailable" class="form-control" />
                    </div>

                    <div class="form-group">
                        <label>Enabled?</label>
                        <input type="checkbox" name="is_enabled" id="isEnabled" class="form-control" />
                    </div>

                    </div>
                    <div class="card-footer">
                        <input type="submit" value="Add" class="btn btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
