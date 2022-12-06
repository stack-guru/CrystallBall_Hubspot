# Apple Podcast Scrapping Service

> ## Requirement overview:
>
> We need to scrap all the episodes of an apple podcast and return the result as json.

>### Files Location:
>
>All the scrapping files exists in `node_app` folder.



>### How to run a server:
> This is tested over Ubuntu 18.04 so if you have different versions of ubuntu or using other OS please make sure to setup accordingly or debug the issue.
>

### Commands

Please run following commands to run the scrapping server

```
1. npm install # install dependencies
2. npm run start # start the server or npm run dev for development. it uses nodemon for the restarting server on file changes.
3. make sure the server is running at port 3000.
```

### Extra Info/Trubleshooting:

1. Make sure that Pupeteer path is correct and when you run there server there is no issues with pupeteer.
2. Please visit https://pptr.dev/ for any issue you face.


### Test scrapping server is setup:

Once you run the server on localhost:3000 than try to run this command to make sure that scrapping server is working fine or not. if not please fix the  error of pupeteer.


```curl -X POST http://localhost:3000/apple-podcast-episodes -H "Content-Type: application/json" -d '{"podcastUrl": "https://podcasts.apple.com/us/podcast/easy-stories-in-english/id1448201565"}' ```