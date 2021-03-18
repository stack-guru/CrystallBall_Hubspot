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
];
