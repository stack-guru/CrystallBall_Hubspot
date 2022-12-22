# Apple Podcast Automation - Backend overview

> ## Requirement overview:
>
> When we have a podcast url from the frontend it should have save all the episodes of the podcast.

>### File Changes
>
> Below is the list of the files that are changed/added while implementing of the feature of apple podcast backend. It also includes the migrations files.
>

```tree
.
├── .env.example
├── config
│   ├── services.php
├── database
│   ├── seeders
│   │   ├── DatabaseSeeder.php
│   │   ├── PermissionSeeder.php
│   ├── migrations
│   │   ├── 2022_11_24_114324_create_apple_podcast_annotations.php
│   │   ├── 2022_11_24_114634_add_apple_podcast_in_user_data_sources_table.php
│   │   ├── 2022_11_24_121716_add_apple_podcast_in_users_table.php
│   │   ├── 2022_11_28_110215_create_apple_podcast_monitors.php
│   │   ├── 2022_11_29_115226_add_apple_podcast_monitor_count_to_price_plans_table.php
│   │   ├── 2022_12_05_113718_create_permissions_table.php
│   │   ├── 2022_12_05_114247_create_permissionable_table.php


app
├── Console
│   ├── Commands
│   │   ├── ApplePodcastAnntation.php
│   └── Kernel.php
├── Http
│   ├── Controllers
│   │   ├── API
│   │   │   ├── ChromeExtension
│   │   │   │   ├── AnnotationController.php
│   │   ├── Admin
│   │   │   ├── SpectatorController.php
│   │   ├── AnnotationController.php
│   │   ├── HomeController.php
│   │   ├── Spectator
│   │   │   ├── DashboardController.php
│   ├── Requests
│   │   ├── ApplePodcastMonitorRequest.php
├── Mail
│   ├── AdminFailedApplePodcastScriptMail.php
├── Models
│   ├── Annotation.php
│   ├── ApplePodcastAnnotation.php
│   ├── ApplePodcastMonitor.php
│   ├── Permission.php
│   ├── PricePlan.php
│   ├── Spectator.php
│   ├── User.php
│   ├── UserDataSource.php

```

The above are the main files that are changed/added for apple podcast automation.php

### Running Server Guide

1. You need to add the a new environment variable `APPLE_PODCAST_DATA_API_URL` to .env file. This will be the url of the scrapping server. Please check [Scrapping](03-scrapping.md) documentation for more information.

