@extends('layouts/admin')
@section('page-title','Payment History')

@section('css')
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css" />
@endsection

@section('content')
<div class="container-fluid">
    <div class="row ml-0 mr-0 justify-content-center">
        <div class="col-md-12 p-5">
            <div class="card">
                <div class="card-header">Payment History</div>
                <div class="card-body">
                    <table aria-label="Payment History" class="table table-hover table-bordered " id="myTable">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">User</th>
                                <th scope="col">User email</th>
                                <th scope="col">BlueSnap vaulted shopper id</th>
                                <th scope="col">Coupon / Discount</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Paid at</th>
                                <th scope="col">Card end with</th>
                                <th scope="col">Next Billing At</th>
                                <th scope="col">Monthly / Yearly</th>
                                <th scope="col">Plan Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($pricePlanSubscriptions as $pricePlanSubscription)
                            <tr>
                                <td>{{$pricePlanSubscription->id}}</td>
                                <td>
                                    {{@$pricePlanSubscription->user->name}}
                                    <!-- 
                                        The logic below is used to track AppSumo refunds.
                                        This logic is not much appreciated and should be 
                                        replaced with something proper  in future
                                    -->
                                    @if(!@$pricePlanSubscription->pricePlan->price && $pricePlanSubscription->app_sumo_invoice_item_uuid)
                                    <span class="badge badge-danger">REFUND</span>
                                    @endif
                                </td>
                                <td>{{@$pricePlanSubscription->user->email}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->bluesnap_vaulted_shopper_id}}</td>
                                <td>@if($pricePlanSubscription->coupon){{$pricePlanSubscription->coupon->code}} / {{$pricePlanSubscription->coupon->discount_percent}}%@endif</td>
                                <td>${{$pricePlanSubscription->charged_price}}</td>
                                <td>{{$pricePlanSubscription->created_at->todateString()}}</td>
                                <td>{{@$pricePlanSubscription->paymentDetail->card_number}}</td>

                                <td>{{$pricePlanSubscription->expires_at}}</td>
                                <td>@if($pricePlanSubscription->plan_duration == 12)Yearly @else Monthly @endif</td>
                                <td>${{@$pricePlanSubscription->pricePlan->price}}</td>
                                <td>
                                    <a href="{{ route('admin.price-plan-subscription.show', $pricePlanSubscription->id) }}" class="btn btn-sm btn-primary">Show</a>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="11" class="alert-danger">No record Found</td>
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

@section('js')
<script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
<script>
    $(document).ready(function() {
        $('#myTable').DataTable({
            order: [
                [6, 'desc']
            ],
            dom: 'Bfrtip',
            buttons: [
                'csv'
            ],
            "paging": true
        });
    });
</script>
@endsection