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
                            <label>Sort Rank</label>
                            <input type="number" name="sort_rank" id="sort_rank" value="{{old('sort_rank',$pricePlan->sort_rank)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" id="name" class="form-control" value="{{old('name',$pricePlan->name ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Code</label>
                            <input type="text" name="code" id="code" class="form-control" value="{{old('code',$pricePlan->code ) }}" readonly />
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" step="0.1" name="price" id="price" class="form-control" value="{{ old('price',$pricePlan->price) }}" />
                        </div>
                        <div class="form-group">
                            <label>Short Description</label>
                            <input type="text" name="short_description" id="short_description" class="form-control" value="{{old('short_description',$pricePlan->short_description ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Badge Text <sub>(it will appear in a badge after plan name)</sub></label>
                            <input type="text" name="badge_text" id="badge_text" class="form-control" value="{{old('badge_text',$pricePlan->badge_text ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Number of annotations <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="annotations_count" id="annotationsCount" class="form-control" value="{{ old('annotations_count',$pricePlan->annotations_count) }}" />
                        </div>
                        <div class="form-group">
                            <label>Google Accounts <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="ga_account_count" id="ga_account_count" value="{{old('ga_account_count',$pricePlan->ga_account_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Users-Teamwork <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="user_per_ga_account_count" id="user_per_ga_account_count" value="{{old('user_per_ga_account_count',$pricePlan->user_per_ga_account_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Web monitor count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="web_monitor_count" id="web_monitor_count" value="{{old('web_monitor_count',$pricePlan->web_monitor_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Keyword Tracking count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="keyword_tracking_count" id="keyword_tracking_count" value="{{old('keyword_tracking_count',$pricePlan->keyword_tracking_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Open Weather Map City count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="owm_city_count" id="owm_city_count" value="{{old('owm_city_count',$pricePlan->owm_city_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Alerts Keyword count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="google_alert_keyword_count" id="google_alert_keyword_count" value="{{old('google_alert_keyword_count',$pricePlan->google_alert_keyword_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Google Analytics Property count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1"  name="google_analytics_property_count" id="google_analytics_property_count" value="{{old('google_analytics_property_count',$pricePlan->google_analytics_property_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Shopify Monitor count? <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1"  name="shopify_monitor_count" id="shopify_monitor_count" value="{{old('shopify_monitor_count',$pricePlan->shopify_monitor_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="users_devices_count">Devices/Browsers allowed per user <sub>(by default its 2 including extension)</sub></label>
                            <input type="number" value="{{old('users_devices_count', $pricePlan->users_devices_count)}}" name="users_devices_count" id="users_devices_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="bitbucket_credits_count">Bitbucket Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="bitbucket_credits_count" value="{{old('bitbucket_credits_count', $pricePlan->bitbucket_credits_count)}}" id="bitbucket_credits_count" class="form-control" />
                        </div>

                        <div class="form-group">
                            <label for="github_credits_count">Github Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="github_credits_count" value="{{old('github_credits_count', $pricePlan->github_credits_count)}}" id="github_credits_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="apple_podcast_monitor_count">Apple Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="apple_podcast_monitor_count" value="{{old('apple_podcast_monitor_count', $pricePlan->apple_podcast_monitor_count)}}" id="apple_podcast_monitor_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="aws_credits_count">AWS Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="aws_credits_count" value="{{old('aws_credits_count', $pricePlan->aws_credits_count)}}" id="aws_credits_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="linkedin_credits_count">Linkedin Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="linkedin_credits_count" value="{{old('linkedin_credits_count', $pricePlan->linkedin_credits_count)}}" id="linkedin_credits_count" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="twitter_credits_count">Twitter Credits count <sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" min="-1" name="twitter_credits_count" value="{{old('twitter_credits_count', $pricePlan->twitter_credits_count)}}" id="twitter_credits_count" class="form-control" />
                        </div>


                        <div class="form-group">
                            <label>Yearly discount percent? <sub>(minimum 0, maximum 100)</sub></label>
                            <input type="number" name="yearly_discount_percent" id="yearly_discount_percent" value="{{old('yearly_discount_percent',$pricePlan->yearly_discount_percent)}}" class="form-control" step="0.01" />
                        </div>
                        <div class="form-group">
                            <label>Reference Text</label>
                            <textarea name="reference_text" id="reference_text" class="form-control" placeholder="">{{old('reference_text',$pricePlan->reference_text)}}</textarea>
                        </div>

                        @if ($pricePlan->custom_plan_code)
                            <div class="form-group">
                                <label>Custom Plan Code</label>
                                <input type="text" name="custom_plan_code" id="custom_plan_code" class="form-control" value="{{ $pricePlan->custom_plan_code }}" readonly />
                                <small>Send this URL to your user: <span class="text-primary" style="cursor: copy;" onclick="window.prompt('Copy to clipboard: Ctrl+C, Enter', this.innerText);">{{ url('settings/custom-price-plan/' . $pricePlan->custom_plan_code) }}</span></small>
                            </div>
                        @endif

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
                            <label>Available? <sub>( Plan can be purchased, otherwise coming soon )</sub></label>
                            <input type="checkbox" name="is_available" id="isAvailable" class="form-control" @if($pricePlan->is_available) checked @endif />
                        </div>

                        <div class="form-group">
                            <label>Enabled? <sub>( Show on pricing page, otherwise not display )</sub></label>
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
