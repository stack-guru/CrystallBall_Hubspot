import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import puppeteer from 'puppeteer';




const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())


app.get('/', function(req, res){
    return res.send('OK');
});


app.post('/apple-podcast-episodes', async (req, res) => {
    const podcastUrl = req.body.podcastUrl;
    if(!podcastUrl) {
        return res.status(500).json({message: "podcastUrl is missing"})
    }

    try {
        console.log(`01: START SCRAPPING EPISODES`)
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            timeout: 10000,
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(podcastUrl, {timeout: 0});
        console.log(`02: PAGE OPEN, WAITING FOR NETWORK`)

        console.log(`03: NETWORK RESOLVED`)
        const showMoreSelector = `[data-metrics-click='{"actionType":"navigate","targetType":"button","targetId":"SeeMoreEpisodes"}']`;

        let hasMoreEpisode = true;

        while(hasMoreEpisode){
            try {
                hasMoreEpisode = await page.$(showMoreSelector)
                if(hasMoreEpisode) {
                    console.log(`04:01  CLICK ON MORE BUTTON`)
                    await page.click(showMoreSelector);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    console.log(`04:02 MORE BUTTON CLICKED`)
                } else {
                    console.log(`04:03 ALL EPISODE LISTED`)
                }

                hasMoreEpisode = await page.$(showMoreSelector)
                console.log(`04:04 ALL EPISODE LISTED`)
            } catch (error) {
                console.log(`Error: ${error?.message}`)
                hasMoreEpisode = false;
            }
        }

        console.log(`05: SCRAPP EPISODES`)

        const trackSelector = `.product-hero__tracks ol li.tracks__track`;

        const episodesResult = await page.evaluate(trackSelector => {
            console.log(`06: PAGE EVALUATED`)
            return [...document.querySelectorAll(trackSelector)].map(track => {
                console.log(`07: RESULT FINALIZE`)

                const date = track.querySelector('time').getAttribute('datetime')
                const url = track.querySelector('a.link').getAttribute('href')
                const title = track.querySelector('h2.tracks__track__headline').innerText
                const description = track.querySelector('div.we-truncate').innerText


                return {
                    date,
                    url,
                    title,
                    description
                }
            });
        }, trackSelector);


        console.log(`08: CLOSE BROWSER`)
        await browser.close();
        console.log(`09: SEND RESULTS`)
        return res.json({status: true, episodesResult});
    } catch (error) {
        return res.status(500).json({status: false, error: error?.message || 'error occur while processing Apple Podcast Url'});
    }
});

app.listen(3000, '0.0.0.0');
console.log('Scrapping server running on port 3000');
