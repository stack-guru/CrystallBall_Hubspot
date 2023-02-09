# shopify store url Automation - Backend overview

> ## Requirement overview:
>
> When we have a podcast url from the frontend it should have save all the episodes of the podcast.

>### File Changes
>
> Below is the list of the files that are changed/added while implementing of the feature of shopify store url backend. It also includes the migrations files.
>

```tree
.
├── .env.example
├── config
│   ├── services.php
├── database
│   ├── seeders
│   │   ├── DatabaseSeeder.php
│   ├── migrations
│   │   ├── 2022_12_21_133919_create_shopify_annotations.php
│   │   ├── 2022_12_21_134110_add_shopify_in_user_data_sources_table.php
│   │   ├── 2022_12_21_134316_add_shopify_in_users_table.php
│   │   ├── 2022_12_21_134556_create_shopify_monitors_table.php
│   │   ├── 2022_12_21_134819_add_shopify_monitor_count_to_price_plans_table.php


app
├── Console
│   ├── Commands
│   │   ├── ShopifyAnnotationCommand.php
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
│   │   ├── ShopifyMonitorController.php
│   │   ├── Spectator
│   │   │   ├── DashboardController.php
│   ├── Requests
│   │   ├── ApplePodcastMonitorRequest.php
├── Mail
│   ├── AdminFailedShopifyScriptMail.php
├── Models
│   ├── Annotation.php
│   ├── ShopifyAnnotation.php
│   ├── ShopifyMonitor.php
│   ├── Permission.php
│   ├── PricePlan.php
│   ├── Spectator.php
│   ├── User.php
│   ├── UserDataSource.php

```

The above are the main files that are changed/added for shopify store url automation.php
