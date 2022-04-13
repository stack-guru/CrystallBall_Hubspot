@extends('layouts.admin')
@section('page-title','Edit Registration Offers')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form action="{{ route('admin.registration-offer.update', $registrationOffer->id) }}" method="POST">
                <div class="card">
                    <div class="card-header">Edit Registration Offer</div>

                    <div class="card-body">
                        @csrf @method('PUT')
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" id="name" class="form-control" value="{{old('name',$registrationOffer->name ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Code</label>
                            <input type="text" name="code" id="code" class="form-control" value="{{old('code',$registrationOffer->code ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Heading</label>
                            <input type="text" name="heading" id="heading" class="form-control" value="{{old('heading',$registrationOffer->heading ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" name="description" id="description" class="form-control" value="{{old('description',$registrationOffer->description ) }}" />
                        </div>
                        <div class="form-group">
                            <label>On Click URL</label>
                            <input type="text" name="on_click_url" id="on_click_url" class="form-control" value="{{old('on_click_url',$registrationOffer->on_click_url ) }}" />
                        </div>
                        <div class="form-group">
                            <label>Discount Percent</label>
                            <input type="number" name="discount_percent" id="discount_percent" class="form-control" value="{{ old('discount_percent',$registrationOffer->discount_percent) }}" />
                        </div>
                        <div class="form-group">
                            <label>Monthly Recurring<sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="monthly_recurring_discount_count" id="monthly_recurring_discount_count" value="{{old('monthly_recurring_discount_count',$registrationOffer->monthly_recurring_discount_count)}}" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Yearly Recurring<sub>(0 means unlimited, -1 means not allowed)</sub></label>
                            <input type="number" name="yearly_recurring_discount_count" id="yearly_recurring_discount_count" value="{{old('yearly_recurring_discount_count',$registrationOffer->yearly_recurring_discount_count)}}" class="form-control" />
                        </div>

                        <div class="form-group">
                            <label>Expire In</label>
                            <input type="number" name="expires_in_value" id="expires_in_value" value="{{old('expires_in_value',$registrationOffer->expires_in_value)}}" class="form-control" />
                            <select name="expires_in_period" id="expires_in_period" class="form-control">
                                @foreach(['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'] as $period)
                                <option value="{{ $period }}" @if(old('expires_in_period',$registrationOffer->expires_in_period) == $period) selected @endif>{{ ucfirst($period) }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Enabled?</label>
                            <input type="checkbox" name="is_enabled" id="isEnabled" class="form-control" @if($registrationOffer->is_enabled) checked @endif />
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