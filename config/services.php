<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
     */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'bluesnap' => [
        'environment' => env('BLUESNAP_ENVIRONMENT', 'sandbox'),
        'api' => [
            'key' => env('BLUESNAP_API_KEY'),
            'password' => env('BLUESNAP_API_PASSWORD'),
        ],
        'client' => [
            'encryption' => [
                'key' => env('BLUESNAP_CLIENT_ENCRYPTION_KEY'),
            ],
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CLIENT_REDIRECT_URI'),

        'calendar' => [
            'api_key' => env('GOOGLE_CALENDAR_API_KEY'),
        ],

        'adwords' => [
            'developer_token' => env('GOOGLE_ADWORDS_DEVELOPER_TOKEN'),
            'manager_account' => [
                'customer_id' => env('GOOGLE_ADWORDS_MANAGER_ACCOUNT_CUSTOMER_ID')
            ]
        ],

        'analytics' => [
            'code' => env('GOOGLE_ANALYTICS_CODE'),
        ],

        'tag_manager' => [
            'code' => env('GOOGLE_TAG_MANAGER_CODE'),
        ],
    ],

    'open_weather_map' => [
        'app' => [
            'id' => env('OPEN_WEATHER_MAP_APP_ID'),
        ],
    ],

    'sendgrid' => [
        'api' => [
            'key' => env('SL_SENDGRID_API_KEY'),
            'id' => env('SL_SENDGRID_API_ID'),
        ],
    ],

    'visual_crossing' => [
        'api' => [
            'key' => env('VISUAL_CROSSING_API_KEY'),
        ],
    ],

    'microsoft' => [
        'clarity' => [
            'code' => env('MICROSOFT_CLARITY_CODE'),
        ],
    ],
    'uptime_robot' => [
        'api_key' => env('UPTIME_ROBOT_API_KEY'),
        'interval' => env('UPTIME_ROBOT_INTERVAL', 60)
    ],

    'pusher' => [
        'beams_instance_id' => env('PUSHER_BEAMS_INSTANCE_ID'),
        'beams_secret_key' => env('PUSHER_BEAMS_SECRET'),
    ],

    'hotjar' => [
        'site' => [
            'code' => env('HOTJAR_SITE_CODE'),
        ],
    ],

    'heap_analytics' => [
        'property' => [
            'code' => env('HEAP_ANALYTICS_PROPERTY')
        ]
    ],

    'recaptcha' => [
        'server' => [
            'key' => env('RECAPTCHA_SERVER_KEY', '')
        ],
        'client' => [
            'key' => env('RECAPTCHA_CLIENT_KEY', '')
        ],
    ],

    'user_back' => [
        'access_token' => env('USER_BACK_ACCESS_TOKEN', '')
    ],

    'first_promoter' => [
        'api' => [
            'key' => env('FIRST_PROMOTER_API_KEY')
        ],
        'cid' => env('FIRST_PROMOTER_CID')
    ],

    'facebook' => [
        //         client's app
        'client_id' => '787240889016012',
        'client_secret' => 'e051b20870412d826641de7d24f41111',
        'redirect' => 'https://lukionline.me/socialite/facebook/redirect',

        // my test app
        //        'client_id' => '787240889016012',
        //        'client_secret' => 'e051b20870412d826641de7d24f41111',
        //        'redirect' => 'https://lukionline.me/socialite/facebook/redirect',
    ],

    'instagram' => [
        'client_id' => '417643546831147',
        'client_secret' => 'af8387d1bf790e75d484e30e4080b4cb',
        'redirect' => 'https://lukionline.me/socialite/instagram/redirect',
    ],

    'instagrambasic' => [
        'client_id' => '5322713981188629',
        'client_secret' => '9a2fd6d6c7c12a8592a1ae1b68613816',
        'redirect' => 'https://lukionline.me/socialite/instagrambasic/redirect',
    ],

    'bitbucket' => [
        'client_id' => env('BITBUCKET_CLIENT_ID'),
        'client_secret' => env('BITBUCKET_CLIENT_SECRET'),
        'redirect' => env('BITBUCKET_REDIRECT_URL'),
    ],

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT_URL'),
    ],

    'apple_podcast' => [
        'data_api_url' => env('APPLE_PODCAST_DATA_API_URL'),
    ],

];
