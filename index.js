

const { Telegraf } = require('telegraf')
const puppeteer = require('puppeteer-extra')

const express = require("express");
const path = __dirname + '/vue-dist/';
const app = express();
const secure_app = express();


app.use(express.static(path));
app.get('/customvalueticker', function (req,res) {
    res.sendFile(path + "index.html");
});

secure_app.get('/', function (req,res) {
    res.status(200).send('OK');
});
const PORT = (process.env.PORT || 80);

secure_app.listen(PORT, () => {
  console.log(`Secure Server is running on port ${PORT}.`);
});

app.listen(8080, () => {
    console.log(`Local Server is running on port 8080.`);
});

require('dotenv').config()

const {
    loadAllTokenIds,
    loadCurrencies,
    loadCoinInfo,
    loadHistoryData,
} = require('./coingeckoAPI')

const {
    getErrorMessage
} = require('./errormessages')


var puppeteerBrowser = null
puppeteer.launch({
    defaultViewport: {
        height: 820,
        width: 1400,
    },
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
}).then(browser => {
    puppeteerBrowser = browser
    initializeBot();
})

function initializeBot() {

const bot = new Telegraf(process.env.TG_BOT_TOKEN)
bot.start((ctx) => ctx.reply('This is the baddays price bot \n \n type /price for the current price'))

bot.command("price", (ctx) => {
    loadAllTokenIds().then((tokenList) => {
        var found = false
        tokenList.map(tokenInfo => {
            if(tokenInfo.name === "Marvelous NFTs") {
                replyWithTicker(ctx, tokenInfo.id, 1, 'USD', 'prices', 'Price', false)
                found = true;
            }
        })
        if(!found)
            ctx.reply(getErrorMessage())
    })
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => {bot.stop('SIGTERM'); puppeteerBrowser.close();})
}

loadAllTokenIds()
var currencies = []
loadCurrencies().then(result => {
    currencies = result
})

function replyWithTicker(ctx, tokenId, days, currency, priceProperty, caption, abbreviateValue = true) {
    loadCoinInfo(tokenId).then(coinInfo => {
        loadHistoryData(tokenId, days, priceProperty).then(tokenHistory => {
            // console.log(coinInfo)
            replyWithBaseTickerImage(ctx,
                coinInfo.symbol.toUpperCase(),
                coinInfo.name,
                tokenHistory.prices[tokenHistory.prices.length-1].y,
                coinInfo.image.large,
                (tokenHistory.prices[tokenHistory.prices.length-1].y * 100 / tokenHistory.prices[0].y) - 100,
                (days > 1 ? days + ' days': '24 hours'),
                coinInfo.market_cap_rank,
                currency.toUpperCase(),
                tokenHistory.prices,
                caption + ' in '+ currency.toUpperCase(),
                abbreviateValue)
        })
    })
}

function replyWithBaseTickerImage(ctx, tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue) {
    replyWithScreenshot(ctx, createBaseTickerUrl(tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue))
}

function replyWithScreenshot(ctx, url) {
    puppeteerBrowser.newPage().then(async page => {
        // page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
        page.goto(url, {"waitUntil" : "networkidle0"}).then(async () => {
            page.screenshot().then(screenshot => {
                ctx.replyWithPhoto({source: screenshot})
            })
        })
    })
}

function createBaseTickerUrl(tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue) {
    var url = 'http://localhost:8080/customvalueticker?'+
        'tokenValue='+tokenValue +
        '&tokenSymbol='+tokenSymbol+
        '&tokenName='+tokenName+
        '&timespan='+timespan+
        '&caption='+caption+
        '&tokenChangePercentage='+tokenChange+
        '&tokenRank='+tokenRank+
        '&conversionCurrency='+conversionCurrency+
        '&graphdata='+JSON.stringify(graphData)+
        '&tokenImage='+tokenImage +
        '&abbreviateValue='+abbreviateValue
    return url;
}