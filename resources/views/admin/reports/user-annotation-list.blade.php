<div id="user-ann-data" class="" data-id="{{ $user->id }}">
    <div class="mb-3 p-2">
        <div>
            <strong>User name:</strong> {{ $user->name }}
        </div>
        <div class="my-1">
            <strong>Total Annotations: </strong> {{ count($annotations) }}
        </div>
        @if ($user->last_screenshot_of_report_at)
            <strong>Last checked at: </strong> {{ $user->last_screenshot_of_report_at }}
        @else
            <strong><u>Not checked previously.</u></strong>
        @endif
    </div>

    <table id="user-ann-table" class="table table-hover gaa-hover table-bordered">

        <thead id="">
            <tr>
                <th scope="col">Category</th>
                <th scope="col">
                    Event Name
                </th>
                <th scope="col">Description</th>
                <th scope="col">Properties</th>
                <th scope="col">Status</th>
                <th scope="col">
                    Show At
                </th>
                <th scope="col">
                    Added By
                </th>
            </tr>
        </thead>
    
        <tbody>
            @foreach ($annotations as $annotation)
                <tr>
                    <td>
                        {{ $annotation->category }}
                    </td>
                    <td>
                        {{ $annotation->event_name }}
                    </td>
                    <td>
                        {{ $annotation->description }}
                    </td>
                    <td>
                        {{ $annotation->google_analytics_property_name }}
                    </td>
                    <td>
                        {{ $annotation->is_enabled ? 'Enabled' : 'Disabled' }}
                    </td>
                    <td>
                        {{ $annotation->show_at }}
                    </td>
                    <td>
                        {{ Str::ucfirst($annotation->added_by) }}
                    </td>
                </tr>
            @endforeach
    
        </tbody>
    
    </table>
    
</div>
