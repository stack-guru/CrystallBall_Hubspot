<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
    <meta charset="utf-8">
    <title>API - Documentation</title>
    <meta name="description" content="">


    <meta http-equiv="cleartype" content="on">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/hightlightjs-dark.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
        integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,500|Source+Code+Pro:300" rel="stylesheet">
    <link rel="stylesheet" href="css/documentation.css" media="all">
    <script>hljs.initHighlightingOnLoad();</script>
</head>

<body>
    <div class="left-menu">
        <div class="content-logo">
            <img alt="platform by Emily van den Heever from the Noun Project"
                title="platform by Emily van den Heever from the Noun Project" src="{{ asset('/images/company_logo.png') }}" height="32" />
            <span>API Documentation</span>
        </div>
        <div class="content-menu">
            <ul>

                <li class="scroll-to-link active" data-target="get-started"><a>GET STARTED</a></li>
                <li class="scroll-to-link" data-target="user-details"><a>User Details <span class="badge badge-success">GET</span></a></li>
                <li class="scroll-to-link" data-target="annotations-list"><a>Annotations List <span class="badge badge-success">GET</span></a></li>
                <li class="scroll-to-link" data-target="add-annotation"><a>Add Annotation <span class="badge badge-warning">POST</span></a></li>
                <li class="scroll-to-link" data-target="change-annotation"><a>Change Annotation <span class="badge badge-info">PUT</span></a></li>
                <li class="scroll-to-link" data-target="delete-annotation"><a>Delete Annotation <span class="badge badge-danger">DELETE</span></a></li>

            </ul>
        </div>
    </div>
    <div class="content-page">
        <div class="content-code"></div>
        <div class="content">
            <div class="overflow-hidden content-section" id="content-get-started">
                <h1 id="get-started">Get started</h1>
                <pre>
    API Endpoint

    {{url("/")}}
                 </pre>
                <p>
                    GAannotations provide API for all actions over annotations
                </p>
                <p>
                    To use this API, you need an <strong>API key</strong>. Please <a
                        href="{{ route('login') }}">login to dashboard</a> to get your own API key.
                </p>
            </div>
            <div class="overflow-hidden content-section" id="content-user-details">
                <h2 id="user-details">User Details</h2>
                <pre><code class="bash">
    # Here is a curl example
    curl --request GET \
  --url {{route('api.v1.user.show')}} \
  --header 'Authorization: Bearer your_api_key'
                 </code></pre>
                <p>
                    To get characters you need to make a <code class="highlighted">GET</code> call to the following url :<br>
                    <code class="higlighted">{{route('api.v1.user.show')}}</code>
                </p>
                <br>
                <pre><code class="json">

    Result example :

    {
        "id": 1,
        "name": "ABC",
        "email": "abc@def.gh",
        "email_verified_at": null,
        "created_at": null,
        "updated_at": "2020-10-29T09:51:08.000000Z",
        "price_plan_id": 2,
        "price_plan_expiry_date": "2020-11-29",
        "annotations_count": 0
    }
                 </code></pre>

                        <h4>QUERY PARAMETERS</h4>
                        <p>None</p>

            </div>

            <div class="overflow-hidden content-section" id="annotations-list">
                <h2 id="annotations-list">Annotation List</h2>
                <pre><code class="bash">
    # Here is a curl example
    curl --request GET \
  --url {{route('api.v1.annotations.index')}} \
  --header 'Authorization: Bearer your_api_key'
                 </code></pre>
                <p>
                    To get characters you need to make a <code class="highlighted">GET</code> call to the following url :<br>
                    <code class="higlighted">{{route('api.v1.annotations.index')}}</code>
                </p>
                <br>
                <pre><code class="json">

    Result example :

    {
        "annotations": [
            {
                "_id": 1,
                "category": "Sales Event",
                "eventSource": {
                    "name": "Black Friday"
                },
                "url": "https://gaannotations.com/",
                "description": "Black Friday Deals 2020",
                "highlighted": false,
                "publishDate": "2020-11-27UTC00:00:000",
            }
        ]
    }
                 </code></pre>

                <h4>QUERY PARAMETERS</h4>
                <p>None</p>

            </div>
{{--     section of annotation list menu ends here       --}}

{{--   add annotation starts        --}}


            <div class="overflow-hidden content-section" id="add-annotation">
                <h2 id="add-annotation">Add Annotation</h2>
                <pre><code class="bash">
    # Here is a curl example
    curl --request POST \
        --url {{route('api.v1.annotations.store')}} \
        --header 'Authorization: Bearer your_api_key' \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data category=Sales Event \
        --data event_name=Black Friday \
        --data google_analytics_account_id[]=3 \
        --data url=https://gaannotations.com/ \
        --data 'description=Black Friday Deals 2020' \
        --data show_at=2020-11-27 \
                 </code></pre>
                <p>
                    To post characters you need to make a <code class="highlighted">POST</code> call to the following url :<br>
                    <code class="higlighted">{{route('api.v1.annotations.store')}}</code>
                </p>
                <br>
                <pre><code class="json">

    Result example :

    {
        "annotation": {
          "category": "Sales Event",
          "event_name": "Black Friday",
          "url": "https://gaannotations.com/",
          "description": "Black Friday Deals 2020",
          "show_at": "2020-11-27",
          "user_id": 1,
          "updated_at": "2020-10-29T10:11:19.000000Z",
          "created_at": "2020-10-29T10:11:19.000000Z",
          "id": 71
        }
    }
                 </code></pre>

                <h4>QUERY PARAMETERS</h4>
                <p>None</p>
            <h4>FORM PARAMETERS</h4>

                <table>
                    <thead>
                    <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description</th>


                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>category</td>
                        <td>String</td>
                        <td>[required] Annotation Category</td>
                    </tr>

                    <tr>
                        <td>event_name</td>
                        <td>String</td>
                        <td>[required] Annotation's Event_name</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>mediumText</td>
                        <td>[required] Annotation's url</td>
                    </tr>
                    <tr>
                        <td>description</td>
                        <td>mediumText</td>
                        <td>[required] Annotation's description</td>
                    </tr>
                    <tr>
                        <td>show_at</td>
                        <td>date</td>
                        <td>[required] Annotation's show_at date from which it will show on google analytics</td>
                    </tr>
                    <tr>
                        <td>google_analytics_account_id[]</td>
                        <td>int</td>
                        <td>[optional] Annotation's google analytics account id with which it will be attached. You can get Ids of your google analytics accounts from <a href="{{ route('google-account.index') }}" target="_blank">here</a>. You can add multiple fields of this name in your request for multiple accounts of same annotation.</td>
                    </tr>

                    </tbody>
                </table>


            </div>

{{--annotation add content ends--}}

            <div class="overflow-hidden content-section" id="change-annotation">
                <h2 id="change-annotation">Change Annotation</h2>
                <pre><code class="bash">
    # Here is a curl example
    curl --request PUT \
        --url {{route('api.v1.annotations.update', 'id')}} \
        --header 'Authorization: Bearer your_api_key' \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data category=Sales Event \
        --data event_name=Black Friday \
        --data google_analytics_account_id[]=4 \
        --data url=https://gaannotations.com/ \
        --data 'description=Black Friday Deals 2020' \
        --data show_at=2020-11-27 \
                 </code></pre>
                <p>
                    To get characters you need to make a <code class="highlighted">PUT</code> call to the following url :<br>
                    <code class="higlighted">{{route('api.v1.annotations.update', "id")}}</code>
                </p>
                <br>
                <pre><code class="json">

    Result example :

    {
        "annotation": {
          "id": 71,
          "user_id": 1,
          "category": "Sales Event",
          "event_name": "Black Friday",
          "url": "https://gaannotations.com/",
          "description": "Black Friday Deals 2020",
          "show_at": "2020-11-27",
          "created_at": "2020-10-29T10:11:19.000000Z",
          "updated_at": "2020-10-29T10:17:25.000000Z",
          "is_enabled": 1
        }
    }
                 </code></pre>

                <h4>QUERY PARAMETERS</h4>
                <table>
                    <thead>
                    <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>id</td>
                        <td>Int</td>
                        <td>[required] id of specific annotation you want to update</td>
                    </tr>
                    </tbody>
                </table>

                <h4>FORM PARAMETERS</h4>

                <table>
                    <thead>
                    <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>category</td>
                        <td>String</td>
                        <td>[required] Annotation Category updated value</td>
                    </tr>
                    <tr>
                        <td>event_name</td>
                        <td>String</td>
                        <td>[required] Annotation's Event_name updated value</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>mediumText</td>
                        <td>[required] Annotation's url updated value</td>
                    </tr>
                    <tr>
                        <td>description</td>
                        <td>mediumText</td>
                        <td>[required] Annotation's description updated value</td>
                    </tr>
                    <tr>
                        <td>show_at</td>
                        <td>date</td>
                        <td>[required] Annotation's show_at date from which it will show on google analytics updated value</td>
                    </tr>
                    <tr>
                        <td>google_analytics_account_id[]</td>
                        <td>int</td>
                        <td>[optional] Annotation's google analytics account id with which it will be attached. You can get Ids of your google analytics accounts from <a href="{{ route('google-account.index') }}" target="_blank">here</a>. You can add multiple fields of this name in your request for multiple accounts of same annotation.</td>
                    </tr>
                    </tbody>
                </table>


            </div>

{{-- annotaion change section ends here--}}


            <div class="overflow-hidden content-section" id="delete-annotation">
                <h2 id="delete-annotation">Delete Annotation</h2>
                <pre><code class="bash">
    # Here is a curl example
    curl --request DELETE \
  --url {{route('api.v1.annotations.destroy', 'id')}} \
  --header 'Authorization: Bearer your_api_key' \
  --header 'Content-Type: application/x-www-form-urlencoded'
                 </code></pre>
                <p>
                    To get characters you need to make a <code class="highlighted">DELETE</code> call to the following url :<br>
                    <code class="higlighted">{{route('api.v1.annotations.destroy','id')}}</code>
                </p>
                <br>
                <pre><code class="json">

    Result example :

    {
        "success": true
    }
                 </code></pre>

                <h4>QUERY PARAMETERS</h4>
                <table>
                    <thead>
                    <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>id</td>
                        <td>Int</td>
                        <td>[required] id of specific annotation you want to Delete</td>
                    </tr>
                    </tbody>
                </table>

            </div>



        </div>
        <div class="content-code"></div>
    </div>
    <!-- Github Corner Ribbon - to remove (Ribbon created with : http://tholman.com/github-corners/ )-->
    {{-- <a href="https://github.com/ticlekiwi/API-Documentation-HTML-Template" class="github-corner"
        aria-label="View source on Github" title="View source on Github"><svg width="80" height="80"
            viewBox="0 0 250 250"
            style="z-index:99999; fill:#70B7FD; color:#fff; position: fixed; top: 0; border: 0; right: 0;"
            aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor" class="octo-body"></path>
        </svg></a> --}}
    <style>
        .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out
        }

        @keyframes octocat-wave {

            0%,
            100% {
                transform: rotate(0)
            }

            20%,
            60% {
                transform: rotate(-25deg)
            }

            40%,
            80% {
                transform: rotate(10deg)
            }
        }

        @media (max-width:500px) {
            .github-corner:hover .octo-arm {
                animation: none
            }

            .github-corner .octo-arm {
                animation: octocat-wave 560ms ease-in-out
            }
        }
    </style>
    <!-- END Github Corner Ribbon - to remove -->
    <script src="js/documentation.js"></script>
</body>

</html>
