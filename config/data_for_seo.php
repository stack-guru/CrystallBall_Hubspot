<?php

return [
    'credentials' => [
        'user' => env('DFS_USER'),
        'pass' => env('DFS_PASS')
    ],
    'search_engines' => [
        [
            'label' => 'Google',
            'value' => 'google'
        ],
        [
            'label' => 'Bing',
            'value' => 'bing'
        ],
        [
            'label' => 'Yahoo',
            'value' => 'yahoo'
        ],
        [
            'label' => 'Baidu',
            'value' => 'baidu'
        ],
        [
            'label' => 'Naver',
            'value' => 'naver'
        ],
    ]
];
