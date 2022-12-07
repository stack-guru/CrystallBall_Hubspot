# Bitbucket Commits Automation - Frontend overview

> ## User story
>
> we need to add the functionality on the frontend where user will have ability to enable/disable bitbucket automation. User can view his existing repositories list and select or unselect repositories to fetch commits.

>### File Changes
>
> Below is the list of the files that are changed/added while implementing of the feature of bitbucket commits.

```tree
resources
├── js
│   └── react
│       └── UserInterface
│           ├── components
│           │   ├── DataSource
│           │   │   └── DataSourceIndex.js
│           ├── utils
│           │   ├── BitBucketTracking.js
```

### Files Overview

1. `BitBucketTracking.js` - This is the entry point of the Bitbucket tracking feature, this file is responsible for toggle the enable/disable of the bitbucket tracking.
2. `DataSourceIndex.js` - This file is where we included the above created file so that it can render it on our page.

### Functionality overview
> pre-defined values or text:
>
> "bitbucket_tracking" text is used as section name.
> "is_ds_bitbucket_tracking_annotation_enabled" text is the annotation name (defined in the backend as well.)

1. `DataSourceIndex.js`
   1.  You can find these two  variables `bitbucket_tracking` and `is_ds_bitbucket_tracking_annotation_enabled` variable is used to handle the logic.
   2. in `serviceStatusHandler` function you will find the logic to enable or disable the logic for bitbucket tracking.
2. `BitBucketTracking.js`
   1. All the basic logic is there, the config section is toggled by the `sectionToggler('bitbucket_tracking')` prop.

This is the overview of all the files that are responsible fot bitbucket commits automation. Please update this when every new changes are made i.e plan limit etc.
