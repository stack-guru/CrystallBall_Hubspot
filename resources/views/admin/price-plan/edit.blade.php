@extends('layouts.admin')
@section('page-title','Edit Price Plans')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form action="{{ route('admin.price-plan.update', $pricePlan->id) }}" method="POST">
                <div class="card">
                    <div class="card-header">Edit Price Plan</div>

                    <div class="card-body">
                        @csrf @method('PUT')
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" id="name" class="form-control" value="{{old('name',$pricePlan->name ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" name="price" id="price" class="form-control" value="{{ old('price',$pricePlan->price) }}" />
                        </div>
                        <div class="form-group">
                            <label>Short Description</label>
                            <input type="text" name="short_description" id="short_description" class="form-control" value="{{old('short_description',$pricePlan->short_description ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Number of annotations</label>
                            <input type="number" name="annotations_count" id="annotationsCount" class="form-control" value="{{ old('annotation_count',$pricePlan->annotations_count) }}" />
                        </div>
                        <div class="form-group">
                            <label>Ga Account Count</label>
                            <input type="number" name="ga_account_count" id="ga_account_count" value="{{old('ga_account_count',$pricePlan->ga_account_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>User per ga-account count?</label>
                            <input type="number" name="user_per_ga_account_count" id="user_per_ga_account_count" value="{{old('user_per_ga_account_count',$pricePlan->user_per_ga_account_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Web monitor count?</label>
                            <input type="number" name="web_monitor_count" id="web_monitor_count" value="{{old('web_monitor_count',$pricePlan->web_monitor_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Open Weather Map City count?</label>
                            <input type="number" name="owm_city_count" id="owm_city_count" value="{{old('owm_city_count',$pricePlan->owm_city_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Alerts Keyword count?</label>
                            <input type="number" name="google_alert_keyword_count" id="google_alert_keyword_count" value="{{old('google_alert_keyword_count',$pricePlan->google_alert_keyword_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Analytics Account count?</label>
                            <input type="number" name="google_analytics_account_count" id="google_analytics_account_count" value="{{old('google_analytics_account_count',$pricePlan->google_analytics_account_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has manual add?</label>
                            <input type="checkbox" name="has_manual_add" id="hasManualAdd" class="form-control" @if($pricePlan->has_manual_add) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has CSV upload?</label>
                            <input type="checkbox" name="has_csv_upload" id="hasCSVUpload" class="form-control" @if($pricePlan->has_csv_upload) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has API?</label>
                            <input type="checkbox" name="has_api" id="hasAPI" class="form-control" @if($pricePlan->has_api) checked @endif />
                        </div>

                        <div class="form-group">
                            <label>Has Integrations?</label>
                            <input type="checkbox" name="has_integrations" id="hasIntegrations" class="form-control" @if($pricePlan->has_integrations) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has Data Sources?</label>
                            <input type="checkbox" name="has_data_sources" id="hasDataSources" class="form-control" @if($pricePlan->has_data_sources) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has Notifications?</label>
                            <input type="checkbox" name="has_notifications" id="hasNotifications" class="form-control" @if($pricePlan->has_notifications) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has Chrome Extension?</label>
                            <input type="checkbox" name="has_chrome_extension" id="hasChromeExtension" class="form-control" @if($pricePlan->has_chrome_extension) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has Google Data Studio?</label>
                            <input type="checkbox" name="has_google_data_studio" id="hasGoogleDataStudio" class="form-control" @if($pricePlan->has_google_data_studio) checked @endif />
                        </div>
                        <div class="form-group">
                            <label>Has Microsoft Power BI?</label>
                            <input type="checkbox" name="has_microsoft_power_bi" id="hasMicrosoftPowerBI" class="form-control" @if($pricePlan->has_microsoft_power_bi) checked @endif />
                        </div>

                        <div class="form-group">
                            <label>Available?</label>
                            <input type="checkbox" name="is_available" id="isAvailable" class="form-control" @if($pricePlan->is_available) checked @endif />
                        </div>

                        <div class="form-group">
                            <label>Enabled?</label>
                            <input type="checkbox" name="is_enabled" id="isEnabled" class="form-control" @if($pricePlan->is_enabled) checked @endif />
                        </div>

                    </div>
                    <div class="card-footer">
                        <input type="submit" value="Save" class="btn btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection