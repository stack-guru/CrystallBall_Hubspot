@extends('layouts.spectator')
@section('page-title', 'Active Users - Reports')

@section('css')
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css" />
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">Users</div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hoved table-bordered" id="myTable">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>User Annotations</th>
                                        <th>Registration Date</th>
                                        <th>Plan</th>
                                        <th>Login to the platform</th>
                                        <th>open the extension in last 30 days</th>
                                        <th>click on a red dot on chart</th>
                                        <th>added an annotation via API</th>
                                        <th>gets an email from Notifications feature</th>
                                        <th>Active</th>
                                        <th>Added Properties</th>
                                        <th>Any Annotation by property</th>
                                        <th>In Use Properties</th>
                                        <th>Is Google Analytics/Search Console Connected</th>
                                        <th>Has Data Studio connected?</th>
                                        <th>Manual Annotations Count</th>
                                        <th>Total Annotations</th>
                                        <th>Last Annotation added at</th>
                                        <th>Data Sources</th>
                                        <th>Total Logins</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($users as $user)
                                        <tr>
                                            <td>{{ $user->name }}</td>
                                            <td>
                                                {{ $user->email }}
                                                @if ($user->user)
                                                    <span class="badge badge-primary">{{ $user->user->email }}</span>
                                                @else
                                                    (Child Users: {{ $user->users_count }})
                                                @endif
                                            </td>
                                            <td class="text-center">
                                                <i onclick="takeUserAnnotationScreenshot(this)"
                                                    data-user_id="{{ $user->id }}"
                                                    class="my-1 btn btn-primary btn-sm fa fa-plus"></i>
                                                <div class="my-3">
                                                    {{ $user->last_screenshot_of_report_at ? 'Last checked at: ' . $user->last_screenshot_of_report_at : 'Not checked previously.' }}
                                                </div>
                                            </td>
                                            <td>{{ $user->created_at }}</td>
                                            <td>{{ @$user->pricePlan->name }}</td>
                                            <td>
                                                {{ $user->last_login_at }} + {{ $user->login_logs_count }}
                                                <a class="btn btn-default btn-sm"
                                                    href="{{ route('spectator.login-log.index', ['user_id' => $user->id]) }}"
                                                    target="_blank">More info</a>
                                            </td>
                                            <td>
                                                {{ $user->lastPopupOpenedChromeExtensionLog->created_at ?? '' }} +
                                                {{ $user->last90_days_popup_opened_chrome_extension_logs_count }}
                                                <a class="btn btn-default btn-sm"
                                                    href="{{ route('spectator.chrome-extension-log.index', ['user_id' => $user->id]) }}"
                                                    target="_blank">More info</a>
                                            </td>
                                            <td>
                                                {{ $user->lastAnnotationButtonClickedChromeExtensionLog->created_at ?? '' }}
                                                + {{ $user->annotation_button_clicked_chrome_extension_logs_count }}
                                                <a class="btn btn-default btn-sm"
                                                    href="{{ route('spectator.chrome-extension-log.index', ['user_id' => $user->id]) }}"
                                                    target="_blank">More info</a>
                                            </td>
                                            <td>
                                                {{ $user->last_api_called_at }} +
                                                {{ $user->last90_days_api_annotation_created_logs_count }}
                                                <a class="btn btn-default btn-sm"
                                                    href="{{ route('spectator.api-log.index', ['user_id' => $user->id]) }}"
                                                    target="_blank">More info</a>
                                            </td>
                                            <td>{{ $user->email_notification_logs_count }} time(s).</td>
                                            <td>
                                                @if ($user->last90_days_popup_opened_chrome_extension_logs_count ||
                                                    $user->last90_days_annotation_button_clicked_chrome_extension_logs_count ||
                                                    $user->last90_days_api_annotation_created_logs_count ||
                                                    $user->last90_days_notification_logs_count ||
                                                    @$user->pricePlan->price ||
                                                    $user->last90_days_login_logs_count)
                                                    Yes
                                                @else
                                                    No
                                                @endif
                                            </td>
                                            <td>{{ $user->google_analytics_properties_count }}</td>
                                            <td>{{ $user->annotation_ga_properties_count }}</td>
                                            <td>{{ $user->google_analytics_properties_in_use_count }}</td>
                                            <td>
                                                <div>
                                                    @foreach ($user->googleAccounts as $googleAccount)
                                                        <div class="my-1 pb-2"
                                                            @if (count($user->googleAccounts) > 1) style="border-top: 1px solid rgba(148, 146, 146, 0.407);" @endif>
                                                            <div>
                                                                <small>{{ $googleAccount->name }}</small>
                                                            </div>
                                                            <div>
                                                                @if ($googleAccount->hasSearchConsoleScope())
                                                                    <div>
                                                                        <span class="text-sm badge badge-success">Search
                                                                            Console</span>
                                                                    </div>
                                                                @endif
                                                                @if ($googleAccount->hasGoogleAnalyticsScope())
                                                                    <div>
                                                                        <span class="text-sm badge badge-success">Google
                                                                            Analytics</span>
                                                                    </div>
                                                                @endif
                                                                @if ($user->googleAccounts->count() > 0)
                                                                    <div class="mt-2 text-center">
                                                                        <small><a
                                                                                href="{{ route('spectator.reports.user-ga-info.show', ['user' => $user->id]) }}"
                                                                                class="text-primary">More info</a></small>
                                                                    </div>
                                                                @endif
                                                            </div>
                                                        </div>
                                                    @endforeach
                                                </div>
                                            </td>
                                            <td>
                                                @if (is_null($user->last_data_studio_used_at))
                                                    No
                                                @else
                                                    Yes
                                                @endif
                                            </td>
                                            <td>{{ $user->manual_annotations_count }}</td>
                                            <td>{{ $user->total_annotations_count }}</td>
                                            <td>{{ @$user->lastAnnotation->created_at }}</td>
                                            <td>
                                                @if ($user->is_ds_holidays_enabled)
                                                    Holiday<br />
                                                @endif
                                                @if ($user->is_ds_google_algorithm_updates_enabled)
                                                    Google Algorithm Updates<br />
                                                @endif
                                                @if ($user->is_ds_retail_marketing_enabled)
                                                    Retail Marketing enabled<br />
                                                @endif
                                                @if ($user->is_ds_weather_alerts_enabled)
                                                    Weather Alerts enabled<br />
                                                @endif
                                                @if ($user->is_ds_google_alerts_enabled)
                                                    Google Alerts enabled<br />
                                                @endif
                                                @if ($user->is_ds_web_monitors_enabled)
                                                    Web Monitors enabled<br />
                                                @endif
                                            </td>
                                            <td>{{ $user->login_logs_count }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @include('admin.reports.user-annotation-list-modal')

@endsection

@section('js')
    <script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
        $(document).ready(function() {
            $('#myTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'csv'
                ],
                "paging": true
            });
        });

        function takeUserAnnotationScreenshot(el) {
            let user_id = $(el).data('user_id');
            let url = "{{ route('spectator.reports.user-annotation-list.show') }}"

            $.ajax(url, {
                type: 'GET', // http method
                data: {
                    user_id: user_id
                },

                success: function(data, status, xhr) {
                    let html = data.html;
                    $('#user_annotation_div_modal').html(html)
                    $('#user_ann_modal').modal('show');
                    
                    // update view time/date
                    let url = "{{ route('spectator.reports.user-annotation-list-view-update') }}"

                    $.ajax(url, {
                        type: 'GET', // http method
                        data: {
                            user_id: user_id
                        },
                        success: function(data, status, xhr) {
                        },
                        error: function(jqXhr, textStatus, errorMessage) {}
                    });
                },
                error: function(jqXhr, textStatus, errorMessage) {}
            });
        }
    </script>
@endsection
