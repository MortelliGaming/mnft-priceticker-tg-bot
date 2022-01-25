
const { Telegraf, Markup } = require('telegraf')

const puppeteer = require('puppeteer-extra')
const { 
    createCoingeckoPriceTickerUrl,
    createBasicTextTickerUrl 
} = require('./urlHelper')

require('dotenv').config()

const {
    getErrorMessage
} = require('./errormessages')

var puppeteerBrowser = null

const bot = new Telegraf(process.env.TG_BOT_TOKEN)
initializeBot = function() {
    bot.start((ctx) => ctx.reply('This is the baddays price bot type \n \n  /price  \n \n /token  \n \n /contract  \n \n /trade'))
    bot.command("price", (ctx) => {
        replyWithMNFTTokenTickerImage(ctx)
    })

    bot.command("contract", (ctx) => {
        ctx.replyWithPhoto({source: './assets/contracts.jpg'}, {caption: '*Polygon:* 0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB \n *BSC:* 0x33BE7644c0E489b3A0c639D103392D4F3e338158 \n *Velas:* 0x4cBA3447E51239065310E24c02C190945ad761d9',
        parse_mode: "Markdown", disable_web_page_preview: true})
    })
    bot.command("trade", (ctx) => {
        // ask bsc/polyon(matic)/velas/cex
        ctx.replyWithPhoto({source: './assets/trading.jpg'}, {caption: '[*Swap on Pancake*](https://pancakeswap.finance/swap?outputCurrency=0x33BE7644c0E489b3A0c639D103392D4F3e338158) \n'+
            '[*Swap on Quickswap*](https://quickswap.exchange/#/swap?outputCurrency=0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB) \n'+
            '[*Trade on Ascendex*](https://ascendex.com/en/basic/cashtrade-spottrading/usdt/mnft)',
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    
    })
    bot.command("bridge", (ctx) => {
        ctx.replyWithPhoto({source: './assets/trading.jpg'}, {caption: 
            '[*Velas <\\-\\> BSC*](https://bridge.velaspad.io/#contract) \n'+
            '[*Polygon <\\-\\> BSC*](https://bridge.terablock.com)',
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })

    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => {bot.stop('SIGTERM'); puppeteerBrowser.close();})
}

module.exports = {
    setupTGBot() {
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
    }
}

function replyWithMNFTTokenTickerImage(ctx) {
    replyWithScreenshot(ctx, createCoingeckoPriceTickerUrl('marvelous-nfts', 1, 'usd'))
}

function replyWithBasicTextTickerImage(ctx, caption, value) {
    replyWithScreenshot(ctx, createBasicTextTickerUrl(caption, value), value)
}

function replyWithScreenshot(ctx, url, caption = null) {
    puppeteerBrowser.newPage().then(async page => {
        // page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
        page.goto(url, {"waitUntil" : "networkidle0"}).then(async () => {
            page.screenshot().then(screenshot => {
                caption === null ? ctx.replyWithPhoto({source: screenshot}) : ctx.replyWithPhoto({source: screenshot}, {caption: caption}) 
                page.close();
            })
        })
    })
}