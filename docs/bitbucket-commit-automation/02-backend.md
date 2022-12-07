# Bitbucket Commits Automation - Backend overview

> ## Requirement overview:
>
> When we have the repositories from the frontend it should have save all the commits of the repositories.

>### File Changes
>
> Below is the list of the files that are changed/added while implementing of the feature of bitbucket tracking backend. It also includes the migrations files.
>

```tree
.
├── .env.example
├── config
│   ├── app.php
│   ├── services.php
├── database
│   ├── migrations
│   │   ├── 2022_11_23_035939_add_is_ds_bitbucket_tracking_enabled.php
│   │   ├── 2022_11_23_040400_add_bitbucket_tracking_in_user_annotation_colors_table.php
│   │   ├── 2022_11_24_010503_create_user_bitbucket_accounts_table.php
│   │   ├── 2022_11_29_012514_add_bitbucket_credits_count_to_price_plans_table.php
│   │   ├── 2022_11_29_094703_add_workspace_to_user_data_sources_table.php
│   │   ├── 2022_11_30_022041_create_bitbucket_commit_annotations_table.php
│   │   ├── 2022_12_01_033511_add_refresh_token_column_to_user_bitbucket_accounts_table.php


app
├── Console
│   ├── Commands
│   │   ├── FetchBitbucketCommits.php
│   └── Kernel.php
├── Http
│   ├── Controllers
│   │   ├── BitbucketAutomationController.php
│   │   ├── HomeController.php
│   │   ├── UserAnnotationColorController.php
│   ├── Requests
│   │   ├── UserAnnotationColorRequest.php
│   │   ├── UserDataSourceRequest.php
├── Models
│   ├── Annotation.php
│   ├── BitbucketCommitAnnotation.php
│   ├── User.php
│   ├── UserAnnotationColor.php
│   ├── UserBitbucketAccount.php
│   ├── UserDataSource.php
├── Repositories
│   ├── BitbucketAutomationRepository.php
├── Services
│   ├── BitbucketService.php

```

The above are the main files that are changed/added for bitbucket commits automation

### Running Server Guide

1. You need to add new environment variables `BITBUCKET_CLIENT_ID`, `BITBUCKET_CLIENT_SECRET`, `BITBUCKET_REDIRECT_URI` to .env file. This will be the credentials of the bitbucket for save connected bitbucket accounts. 

