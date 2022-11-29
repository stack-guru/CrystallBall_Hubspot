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
                            <label>Sort Rank</label>
                            <input type="number" name="sort_rank" id="sort_rank" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" id="name" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Code</label>
                            <input type="text" name="code" id="code" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" step="0.1" name="price" id="price" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Short Description</label>
                            <input type="text" name="short_description" id="short_description" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Badge Text <sub>(it will appear in a badge after plan name)</sub></label>
                            <input type="text" name="badge_text" id="badge_text" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Number of annotations <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="annotations_count" id="annotationsCount" class="form-control" value="0" />
                        </div>
                        <div class="form-group">
                            <label>Ga Account Count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="ga_account_count" id="ga_account_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>User per ga-account count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="user_per_ga_account_count" id="user_per_ga_account_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Web monitor count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="web_monitor_count" id="web_monitor_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Open Weather Map City count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="owm_city_count" id="owm_city_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Alerts Keyword count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="google_alert_keyword_count" id="google_alert_keyword_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Analytics Property count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="google_analytics_property_count" id="google_analytics_property_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="users_devices_count">Devices/Browsers allowed per user <sub>(by default its 2 including extension)</sub></label>
                            <input type="number" min="1" name="users_devices_count" id="users_devices_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="bitbucket_credits_count">Bitbucket Credits count</label>
                            <input type="number" min="1" name="bitbucket_credits_count" id="bitbucket_credits_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Yearly discount percent? <sub>(minimum 0, maximum 100)</sub></label>
                            <input type="number" name="yearly_discount_percent" id="yearly_discount_percent" class="form-control" />
                        </div>


                        <div class="form-group">
                            <label>Custom Plan Code</label>
                            <input type="text" name="custom_plan_code" id="custom_plan_code" class="form-control" />
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
                            <label>Has Notifications?</label>
                            <input type="checkbox" name="has_notifications" id="hasNotifications" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has Chrome Extension?</label>
                            <input type="checkbox" name="has_chrome_extension" id="hasChromeExtension" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has Google Data Studio?</label>
                            <input type="checkbox" name="has_google_data_studio" id="hasGoogleDataStudio" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Has Microsoft Power BI?</label>
                            <input type="checkbox" name="has_microsoft_power_bi" id="hasMicrosoftPowerBI" class="form-control" />
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
