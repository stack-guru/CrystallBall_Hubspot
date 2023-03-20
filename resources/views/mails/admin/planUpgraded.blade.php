<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <title>Plan Upgraded</title>


    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>

    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
            </div>
        </nav>

        <main class="py-4">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">Plan Upgraded</div>

                            <div class="card-body">
                                <h3>Hi, {{ $admin->name }}!</h3>
                                <p>{{ $user->name }} ({{ $user->email}}) has upgraded his/her account's payment plan to "{{ $user->pricePlan->name }}".</p>
                                <p>Please login to your dashboard for more details.</p>
                                
                                @foreach ($user->pricePlanSubscriptions as $pricePlanSubscription)
                                <p>Payment History</p>
                                
                                <table aria-label="Payment History" class="table table-hover table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">User</th>
                                            <th scope="col">User email</th>
                                            <th scope="col">Coupon / Discount</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Paid at</th>
                                            <th scope="col">Next Billing At (Duration)</th>
                                            <th scope="col">Plan Name</th>
                                            <th scope="col">Plan Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ $pricePlanSubscription->id }}</td>
                                            <td>{{ $pricePlanSubscription->user->name }}</td>
                                            <td>{{ $pricePlanSubscription->user->email }}</td>
                                            <td>
                                                @if ($pricePlanSubscription->coupon)
                                                    {{ $pricePlanSubscription->coupon->code }} /
                                                    {{ $pricePlanSubscription->coupon->discount_percent }}%
                                                @endif
                                            </td>
                                            <td>${{ $pricePlanSubscription->charged_price }}</td>
                                            <td>{{ $pricePlanSubscription->created_at->todateString() }}</td>

                                            <td>{{ $pricePlanSubscription->expires_at }}
                                                ({{ $pricePlanSubscription->plan_duration }})
                                            </td>
                                            <td>{{ @$pricePlanSubscription->pricePlan->name }}</td>
                                            <td>${{ @$pricePlanSubscription->pricePlan->price }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table aria-label="Invoice Details" class="table table-hover table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Company Name</th>
                                            <th scope="col">Company Registration Number</th>
                                            <th scope="col">Company Phone Number</th>
                                            <th scope="col">BlueSnap vaulted shopper id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Card end with</th>
                                            <th scope="col">Expiry</th>
                                            <th scope="col">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->company_name }}</td>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->company_registration_number }}
                                            </td>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->phone_number_prefix }}
                                                {{ @$pricePlanSubscription->paymentDetail->phone_number }}</td>

                                            <td>{{ @$pricePlanSubscription->paymentDetail->bluesnap_vaulted_shopper_id }}
                                            </td>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->first_name }}
                                                {{ @$pricePlanSubscription->paymentDetail->last_name }}</td>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->card_number }}</td>
                                            <td>{{ @$pricePlanSubscription->paymentDetail->expiry_month }} /
                                                {{ @$pricePlanSubscription->paymentDetail->expiry_year }}</td>
                                            <td>
                                                {{ @$pricePlanSubscription->paymentDetail->billing_address }}<br />
                                                {{ @$pricePlanSubscription->paymentDetail->city }}
                                                {{ @$pricePlanSubscription->paymentDetail->country }}<br />
                                                {{ @$pricePlanSubscription->paymentDetail->zip_code }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>

</html>
