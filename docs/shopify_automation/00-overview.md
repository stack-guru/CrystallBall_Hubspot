# Shopify Automation overview

> ## User story
>
> In this automation, we need to add the functionality in our crystalball platform, so that user can have changes for the Shopify Products.
i.e The [cupshe](https://www.cupshe.com) shopify store, when user start automation he have all the annotation of existing products. The category will be "New Shopify Product", "Update Shopify Product", "Removed Shopify Product"

### Steps to implement

#### 1. [Setup frontend](01-frontend.md)

        1. Add New automation card for shopify, where user can start/stop automation.
        2. Added options for the user to add shopify store url
        3. Send a shopify store url to backend, to save.
        4. User can add/delete the existing shopify store url.
        5. Display the shopify store products to the automation.

#### 2. [Setup backend](02-backend.md)

        1. Create migrations for the new table to save shopify store products.
        2. Add route to save the shopify store url
        3. Create routes to handle the shopify store url CRUD operations
        4. Save the episodes for the shopify store url.
