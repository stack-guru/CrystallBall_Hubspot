<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <title>Analytic and Console Report</title>


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
								<p>Hi,</p>
								<span>Your anayltic report for Property ({{@$property->name}}) and Site From {{@$shared_report->start_date}} To {{@$shared_report->end_date}} is here!</span><br>
								<span>Please see the attachment provided.</span><br><br>
								@if(@$shared_report)
								<span><a href="{{url('shared_report/download/'.@$shared_report->id)}}">Download Analytic Report File</a> </span>
								@endif
                                <h3 class="">Analytics Stats</h3>
                                <div style="overflow-x:auto;" style="min-height: 200px;">
                                    <table aria-label="Activity and Transaction" class="table table-borderd table-striped" style="min-height: 200px;">
                                        <thead>
                                            <tr>
                                                <th scope="col">Total Users</th>
                                                <th scope="col">Total Sessions</th>
                                                <th scope="col">Total Events</th>
                                                <th scope="col">Total Conversions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>
                                                    {{ @$data['topStatisticsIndex']['statistics']->sum_users_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['topStatisticsIndex']['statistics']->sum_sessions_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['topStatisticsIndex']['statistics']->sum_events_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['topStatisticsIndex']['statistics']->sum_conversions_count }}
                                                </td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>

                                <div class="my-5">
                                    <h3>Users Days Annotations</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Users Days Annotations" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Event Name</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Show At</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Statistics Date</th>
                                                    <th scope="col">Seven Day Old Date</th>
                                                    <th scope="col">Sum Users Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['usersDaysAnnotationsIndex']['statistics']) > 0)
													@foreach ($data['usersDaysAnnotationsIndex']['statistics'] as $user_day_annotation)
                                                        <tr>
                                                            <td> {{ $user_day_annotation['event_name'] }}</td>
                                                            <td> {{ $user_day_annotation['category'] }}</td>
                                                            <td> {{ $user_day_annotation['show_at'] }}</td>
                                                            <td> {{ $user_day_annotation['description'] }}</td>
                                                            <td> {{ $user_day_annotation['statistics_date'] }}</td>
                                                            <td> {{ $user_day_annotation['seven_day_old_date'] }}</td>
                                                            <td> {{ $user_day_annotation['sum_users_count'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="7">
                                                            No Users Days Annotations..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Annotations Metrics Dimensions</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Annotations Metrics Dimensions" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Event Name</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Show At</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Statistics Date</th>
                                                    <th scope="col">Total Users</th>
                                                    <th scope="col">Total Sessions</th>
                                                    <th scope="col">Total Conversions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['annotationsMetricsDimensionsIndex']['annotations']) > 0)
													@foreach ($data['annotationsMetricsDimensionsIndex']['annotations'] as $annotation)
                                                        <tr>
                                                            <td> {{ $annotation['event_name'] }}</td>
                                                            <td> {{ $annotation['category'] }}</td>
                                                            <td> {{ $annotation['show_at'] }}</td>
                                                            <td> {{ $annotation['description'] }}</td>
                                                            <td> {{ $annotation['statistics_date'] }}</td>
                                                            <td> {{ $annotation['sum_users_count'] }}</td>
                                                            <td> {{ $annotation['sum_conversions_count'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="8">
                                                            No Annotations Metrics Dimensions..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Media</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Media" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Media Name</th>
                                                    <th scope="col">Total Users</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['mediaIndex']['statistics']) > 0)
													@foreach ($data['mediaIndex']['statistics'] as $media)
                                                        <tr>
                                                            <td> {{ @$media->medium_name }}</td>
                                                            <td> {{ @$media->sum_users_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="2">
                                                            No Media..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Sources</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Media" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Source Name</th>
                                                    <th scope="col">Total Users</th>
                                                    <th scope="col">Total Events</th>
                                                    <th scope="col">Total Conversions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['sourcesIndex']['statistics']) > 0)
													@foreach ($data['sourcesIndex']['statistics'] as $source)
                                                        <tr>
                                                            <td> {{ @$source->source_name }}</td>
                                                            <td> {{ @$source->sum_users_count }}</td>
                                                            <td> {{ @$source->sum_events_count }}</td>
                                                            <td> {{ @$source->sum_conversions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="4">
                                                            No Source..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Device Categories</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Device Categories" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Device Category Name</th>
                                                    <th scope="col">Total Users</th>
                                                    <th scope="col">Total Events</th>
                                                    <th scope="col">Total Conversions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['deviceCategoriesIndex']['statistics']) > 0)
													@foreach ($data['deviceCategoriesIndex']['statistics'] as $device_category)
                                                        <tr>
                                                            <td> {{ @$device_category->device_category }}</td>
                                                            <td> {{ @$device_category->sum_users_count }}</td>
                                                            <td> {{ @$device_category->sum_events_count }}</td>
                                                            <td> {{ @$device_category->sum_conversions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="4">
                                                            No Device Categories..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Devices By Impression</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Devices By Impression" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Device Name</th>
                                                    <th scope="col">Clicks Count</th>
                                                    <th scope="col">Impression Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['devicesIndexByImpression']['statistics']) > 0)
													@foreach ($data['devicesIndexByImpression']['statistics'] as $devices_by_impression)
                                                        <tr>
                                                            <td> {{ @$devices_by_impression->device }}</td>
                                                            <td> {{ @$devices_by_impression->sum_clicks_count }}</td>
                                                            <td> {{ @$devices_by_impression->sum_impressions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="3">
                                                            No Device By Impressions..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Countries</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Countries" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country Name</th>
                                                    <th scope="col">Clicks Count</th>
                                                    <th scope="col">Impression Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['countriesIndex']['statistics']) > 0)
													@foreach ($data['countriesIndex']['statistics'] as $country)
                                                        <tr>
                                                            <td> {{ @$country->country }}</td>
                                                            <td> {{ @$country->sum_clicks_count }}</td>
                                                            <td> {{ @$country->sum_impressions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="3">
                                                            No Countries..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Console Top Statistics</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Console Top Statistics" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Total Clicks</th>
                                                    <th scope="col">Total Impressions</th>
                                                    <th scope="col">Max Click Through Rate</th>
                                                    <th scope="col">Min Position Rank</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <td>
                                                    {{ @$data['consoletopStatisticsIndex']['statistics']->sum_clicks_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['consoletopStatisticsIndex']['statistics']->sum_impressions_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['consoletopStatisticsIndex']['statistics']->max_ctr_count }}
                                                </td>
                                                <td>
                                                    {{ @$data['consoletopStatisticsIndex']['statistics']->min_position_rank }}
                                                </td>

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Clicks Impressions Days Annotations</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Clicks Impressions Days Annotations" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Event Name</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Show At</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Statistics Date</th>
                                                    <th scope="col">Seven Day Old Date</th>
                                                    <th scope="col">Sum Clicks Count</th>
                                                    <th scope="col">Sum Impressions Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['clicksImpressionsDaysAnnotationsIndex']['statistics']) > 0)
													@foreach ($data['clicksImpressionsDaysAnnotationsIndex']['statistics'] as $clicks_impressions_annotation)
                                                        <tr>
                                                            <td> {{ $clicks_impressions_annotation['event_name'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['category'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['show_at'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['description'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['statistics_date'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['seven_day_old_date'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['sum_clicks_count'] }}</td>
                                                            <td> {{ $clicks_impressions_annotation['sum_impressions_count'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="8">
                                                            No Clicks Impressions Days Annotations..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Annotations Dates</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Annotations Dates" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Event Name</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Show At</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Statistics Date</th>
                                                    <th scope="col">Total Clicks</th>
                                                    <th scope="col">Total Impressions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['annotationsDatesIndex']['annotations']) > 0)
													@foreach ($data['annotationsDatesIndex']['annotations'] as $console_annotation)
                                                        <tr>
                                                            <td> {{ $console_annotation['event_name'] }}</td>
                                                            <td> {{ $console_annotation['category'] }}</td>
                                                            <td> {{ $console_annotation['show_at'] }}</td>
                                                            <td> {{ $console_annotation['description'] }}</td>
                                                            <td> {{ $console_annotation['statistics_date'] }}</td>
                                                            <td> {{ $console_annotation['sum_clicks_count'] }}</td>
                                                            <td> {{ $console_annotation['sum_impressions_count'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="7">
                                                            No Annotations Dates..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Queries</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Queries" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Query</th>
                                                    <th scope="col">Clicks Count</th>
                                                    <th scope="col">Impressions Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['queriesIndex']['statistics']) > 0)
													@foreach ($data['queriesIndex']['statistics'] as $query)
                                                        <tr>
                                                            <td> {{ @$query->query }}</td>
                                                            <td> {{ @$query->sum_clicks_count }}</td>
                                                            <td> {{ @$query->sum_impressions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="3">
                                                            No Queries..
                                                        </td>
                                                    </tr>
                                                @endif

                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                                <div class="my-5">
                                    <h3>Pages</h3>
                                    <div style="overflow-x:auto;">
                                        <table aria-label="Queries" class="table table-borderd table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Page</th>
                                                    <th scope="col">Clicks Count</th>
                                                    <th scope="col">Impressions Count</th>
                                                </tr>
                                            </thead>

                                            <tbody>
												@if(count($data['pagesIndex']['statistics']) > 0)
													@foreach ($data['pagesIndex']['statistics'] as $page)
                                                        <tr>
                                                            <td> {{ @$page->page }}</td>
                                                            <td> {{ @$page->sum_clicks_count }}</td>
                                                            <td> {{ @$page->sum_impressions_count }}</td>
														</tr>
                                                    @endforeach
                                                @else
                                                    <tr>
                                                        <td colspan="3">
                                                            No Pages..
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