# Shopify store Automation - Frontend overview

> ## User story
>
> we need to add the functionality on the frontend where user will have ability to enable/disable shopify store automation. User can view his existing shopify store url list and manage that or add shopify store url to the list.

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
│           │   ├── ShopifyStore
│           │   │   ├── ShopifyStoreConfig.css
│           │   │   ├── ShopifyStoreConfig.js
│           │   │   └── index.js
```

### Files Overview

1. `ShopifyStore/index.js` - This is the entry point of the Shopify feature, this file is responsible for toggle the enable/disable of the Shopify. It also contains the button that is used to toggle config panel.
2. `ShopifyStoreConfig.js` - This is the configuration file. This contains the UI and logic of the Shopify Store url. i.e adding or removing the Shopify Store URL.
3. `DataSourceIndex.js` - This file is where we included the above created file so that it can render it on our page.

### Functionality overview
> pre-defined values or text:
>
> "shopify_store" text is used as section name.
> "is_ds_shopify_store_annotation_enabled" text is the annotation name (defined in the backend as well.)

1. `DataSourceIndex.js`
   1.  You can find these two  variables `shopify_store` and `is_ds_shopify_store_annotation_enabled` variable is used to handle the logic.
   2. in `serviceStatusHandler` function you will find the logic to enable or disable the logic for Shopify Store.
2. `ShopifyStore/index.js`
   1. All the basic logic is there, the config section is toggled by the `sectionToggler('shopify_store')` prop.
3. `ShopifyStoreConfig.js`
   1. This is the main file to have all the main functionality. It is responsible list the existing Shopify Store url.
      1. Save/Add Shopify Store Url:
         1. The endpoint `/data-source/shopify_url` is a post request that accept the `shopifyUrl, gaPropertyId`.
      2. On adding the URL the Shopify Store Url are added by the "Shopify"
      3. Delete - `/data-source/shopify-monitor/{{ID}}` is delete endpoint. That delete the shopify store url.

This is the overview of all the files that are responsible for shopify store url automation. Please update this when every new changes are made i.e plan limit etc.
