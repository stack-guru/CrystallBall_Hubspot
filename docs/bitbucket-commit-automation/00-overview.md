# Bitbucket Commits Automation overview

> ## User story
>
> In this automation, we need to add the functionality in our crystalball platform, so that user can have changes for the bitbucket commits.
> i.e The [Bitbucket Commit](https://bitbucket.org/hintentteam/dev_gaannotations/commits/45d96578988a59f08640c9fea230aebdee5bca46 "Bitbucket Commit") Bitbucket have some repositories, when user start automation he have all the annotation of existing commits for selected repositories.

### Steps to implement

#### 1. [Setup frontend](01-frontend.md)

        1. Add New automation card for bitbucket commit, where user can start/stop bitbucket commit automation.
        2. Add options for the user to select repositories
        3. Send selected repositories information to backend, to save.
        4. User can select/unselect the repositories.
        5. Display the bitbucket commits to the automation.

#### 2. [Setup backend](02-backend.md)

        1. Create migrations for the new table to save bitbucket commit automation
        2. Add route to save the bitbucket account and selected repositories
        3. Create routes to handle the bitbucket repositories CRUD operations
        4. Save the commits for the selected bitbucket repositories.

#### 4. [Deployment/Trubleshooting Steps](03-setup.md)

        1. Missing libraries
        2. Running server
