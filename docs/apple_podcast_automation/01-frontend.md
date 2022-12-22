# Apple Podcast Automation - Frontend overview

> ## User story
>
> we need to add the functionality on the frontend where user will have ability to enable/disable podcast automation. User can view his existing podcast list and manage that or add new podcast to the list.

>### File Changes
>
> Below is the list of the files that are changed/added while implementing of the feature of apple podcast.

```tree
resources
├── js
│   └── react
│       └── UserInterface
│           ├── components
│           │   ├── DataSource
│           │   │   └── DataSourceIndex.js
│           ├── utils
│           │   ├── ApplePodcast
│           │   │   ├── ApplePodcastConfig.css
│           │   │   ├── ApplePodcastConfig.js
│           │   │   └── index.js
```

### Files Overview

1. `ApplePodcast/index.js` - This is the entry point of the Apple podcast feature, this file is responsible for toggle the enable/disable of the apple podcast. It also contains the button that is used to toggle config panel.
2. `ApplePodcastConfig.js` - This is the configuration file. This contains the UI and logic of the Apple podcast url. i.e search of apple podcast, adding or removing the podcast.
3. `DataSourceIndex.js` - This file is where we included the above created file so that it can render it on our page.

### Functionality overview
> pre-defined values or text:
>
> "apple_podcast" text is used as section name.
> "is_ds_apple_podcast_annotation_enabled" text is the annotation name (defined in the backend as well.)

1. `DataSourceIndex.js`
   1.  You can find these two  variables `apple_podcast` and `is_ds_apple_podcast_annotation_enabled` variable is used to handle the logic.
   2. in `serviceStatusHandler` function you will find the logic to enable or disable the logic for apple podcast.
2. `ApplePodcast/index.js`
   1. All the basic logic is there, the config section is toggled by the `sectionToggler('apple_podcast')` prop.
3. `ApplePodcastConfig.js`
   1. This is the main file to have all the main functionality. It is responsible for search and list the existing podcasts url.
      1. Search:
         1. For Search the apple official API is used. Here is the endpoint https://itunes.apple.com
         2. You can read more about the api here https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html
         3. Once user search the results, a button is shown to user on podcast preview to create annotations. Once user select the request is sent to backend to process and save the url/selected episode.
      2. Save/Add Episode Url:
         1. The endpoint `/data-source/apple_podcast_url` is a post request that accept the `collectionViewUrl, gaPropertyId, collectionId` as required and other are optional.
      3. On adding the URL the apple podcast episode annotations are added by the system
      4. Delete - `/data-source/apple-podcast-monitor/{{ID}}` is delete endpoint. That delete the podcast url.

This is the overview of all the files that are responsible fot apple podcast automation. Please update this when every new changes are made i.e plan limit etc.
