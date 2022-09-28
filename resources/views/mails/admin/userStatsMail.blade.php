<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <title>User Stats</title>


    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>

</head>

<body>

    <div id="app">

        <div class="py-4">
            <div class="mx-2">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">

                            <div class="card-body">
                                <h3 class="">Activity and Traction</h3>
                                <div style="overflow-x:auto;" style="min-height: 200px;">
                                    <table class="table table-borderd table-striped" style="min-height: 200px;">
                                        <thead>
                                            <tr>
                                                <th>Yesterday Registrations</th>
                                                <th>Current Month Registrations</th>
                                                <th>Previous Month Registrations</th>
                                                <th>New Paying Users Yesterday</th>
                                                <th>Number Of Actions</th>
                                                <th>Total Payments This Month</th>
                                                <th>Total Payments Previous Month</th>
                                                <th>MMR</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>
                                                    {{ @$data['yesterday_registration_count'] }}
                                                </td>
                                                <td>
                                                    {{ @$data['current_month_registration_count'] }}
                                                </td>
                                                <td>
                                                    {{ @$data['previous_month_registration_count'] }}
                                                </td>
                                                <td>
                                                    {{ @$data['new_paying_users_yesterday_count'] }}
                                                </td>
                                                <td>
                                                    {{-- {{ @$data['number_of_actions_count'] }} --}}
                                                </td>
                                                <td>
                                                    {{ @$data['total_payments_this_month'] }}
                                                </td>
                                                <td>
                                                    {{ @$data['total_payments_previous_month'] }}
                                                </td>
                                                <td>
                                                    {{ @$data['mmr'] }}
                                                </td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>


                                <div class="my-5">
                                    <h3>Users Registered Yesterday</h3>
                                    <div style="overflow-x:auto;">
                                        <table class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                @if (isset($data['yesterday_registration_users']))
                                                    @foreach ($data['yesterday_registration_users'] as $email=>$name)
                                                        <tr>
                                                            <td>
                                                                {{ $name }}
                                                            </td>
                                                            <td>
                                                                {{ $email }}
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="2">
                                                            No new registrations yesterday..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>


                                <div class="my-5">
                                    <h3>New Paying Users Yesterday</h3>
                                    <div style="overflow-x:auto;">
                                        <table class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Plan</th>
                                                    <th>Charged Price</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                @if (isset($data['new_paying_users_yesterday']))
                                                    @foreach ($data['new_paying_users_yesterday'] as $price_plan_sub)
                                                        <tr>
                                                            <td>
                                                                {{ $price_plan_sub->user->name ?? '' }}
                                                            </td>
                                                            <td>
                                                                {{ $price_plan_sub->user->email ?? '' }}
                                                            </td>
                                                            <td>
                                                                {{ $price_plan_sub->pricePlan->name ?? '' }}
                                                                -
                                                                @if ($price_plan_sub->user->lastPricePlanSubscription && $price_plan_sub->user->lastPricePlanSubscription->plan_duration)
                                                                    @if ($price_plan_sub->user->lastPricePlanSubscription->plan_duration == 12)
                                                                        Annually
                                                                    @elseif($price_plan_sub->user->lastPricePlanSubscription->plan_duration == 1)
                                                                        Monthly
                                                                    @endif
                                                                @else
                                                                    N/A
                                                                @endif
                                                            </td>
                                                            <td>
                                                                {{ $price_plan_sub->charged_price ?? '' }}
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="4">
                                                            No new paying users yesterday..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
