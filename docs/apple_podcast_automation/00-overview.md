# Apple Podcast Automation overview

> ## User story
>
> In this automation, we need to add the functionality in our crysalball platform, so that user can have changes for the apple podcast episodes.
i.e The [Apple Events (audio)](https://podcasts.apple.com/us/podcast/apple-events-audio/id1473854035?uo=4 "Apple Events (audio)") podcast has some episodes, when user start automation he have all the annotation of existing episodes.

### Steps to implement

#### 1. [Setup frontend](01-frontend.md)

        1. Add New automation card for apple podcast, where user can start/stop apple podcast automation.
        2. Add options for the user to add podcast url
        3. Send a podcast url to backend, to save.
        4. User can add/delete the existing podcast url.
        5. Display the apple podcast to the automation.

#### 2. [Setup backend](02-backend.md)

        1. Create migrations for the new table to save apple podcasts
        2. Add route to save the podcast url
        3. Create routes to handle the apple podcast url CRUD operations
        4. Save the episodes for the apple podcast url.

#### 3. [Scrapping](03-scrapping.md)

        1. Pupeteer overview
        2. Scrapping server setup
        3. Code overview
        4. TODOs

#### 4. [Deployment/Trubleshooting Steps](04-setup.md)

        1. Missing libraries
        2. Running server
        3. Validate scrapping server is running
