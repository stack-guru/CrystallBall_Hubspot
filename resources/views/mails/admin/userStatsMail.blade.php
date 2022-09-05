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
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
            </div>
        </nav>

        <div class="py-4">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">User Stats For Today</div>

                            <div class="card-body">
                                <table class="table table-borderd table-striped">
                                    <thead>
                                        <tr>
                                            <th>Active Users Yesterday</th>
                                            <th>Active Users 30 Days</th>
                                            <th>Active Users 60 Days</th>
                                            <th>Total Registrations</th>
                                            <th>Yesterday Registrations</th>
                                            <th>Last Week Registrations</th>
                                            <th>Current Month Registrations</th>
                                            <th>Previous Month Registrations</th>
                                            <th>New Paying Users Yesterday</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                {{ @$data['active_users_yesterday'] }}
                                            </td>
                                            <td>
                                                {{ @$data['active_users_in_30_days'] }}
                                            </td>
                                            <td>
                                                {{ @$data['active_users_in_60_days'] }}
                                            </td>
                                            <td>
                                                {{ @$data['total_registration_count'] }}
                                            </td>
                                            <td>
                                                {{ @$data['yesterday_registration_count'] }}
                                            </td>
                                            <td>
                                                {{ @$data['last_week_registration_count'] }}
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
                                        </tr>
                                    </tbody>

                                </table>

                                <div class="my-5">
                                    <h2>Users Registered Yesterday</h2>
                                    <table class="table table-borderd table-striped">
                                        <thead>
                                            <tr>
                                                <th>User Name</th>
                                                <th>User Email</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            @if (isset($data['yesterday_registration_users']))
                                                @foreach ($data['yesterday_registration_users'] as $user)
                                                    <tr>
                                                        <td>
                                                            {{ @$user['name'] }}
                                                        </td>
                                                        <td>
                                                            {{ @$user['email'] }}
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


                                <div class="my-5">
                                    <h2>New Paying Users Yesterday</h2>
                                    <table class="table table-borderd table-striped">
                                        <thead>
                                            <tr>
                                                <th>User Name</th>
                                                <th>User Email</th>
                                                <th>User Plan</th>
                                                <th>Charged Price</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            @if (isset($data['new_paying_users_yesterday']))
                                                @foreach ($data['new_paying_users_yesterday'] as $user)
                                                    <tr>
                                                        <td>
                                                            {{ $user->name ?? '' }}
                                                        </td>
                                                        <td>
                                                            {{ $user->email ?? '' }}
                                                        </td>
                                                        <td>
                                                            {{ $user->pricePlan->name ?? '' }}
                                                        </td>
                                                        <td>
                                                            {{ $user->paymentDetail->charged_price ?? '' }}
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
</body>

</html>
