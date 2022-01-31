
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

const commandsMessage = 'Following commands are available:\n\n'+
    '*commands* \\- shows all commands\n' +
    '*price* \\- shows a ticker image with the current price\n' +
    '*contract* \\- shows the contracts and links\n' +
    '*trade* \\- shows the links to trading platforms\n' +
    '*bridge* \\- shows the links to the bridges\n' +
    '*audit* \\- shows the audit link\n' +
    '*claim* \\- shows the MNFT claim link\n' +
    '*discord* \\- shows link to our discord\n' +
    '*fee* \\- shows what happens with the trading fees\n' +
    '*feedback* \\- shows the link to the google feedback form'

const auditMessage = '*MarvelousNFTs MNFT Hacken Audit Report:* \n \n'+
    '[https://marvelousnfts\\.com/](https://marvelousnfts.com/news-detail?n_id=228) \n\n'+
    'We’re pleased to publicise the results of our recent Audit from Hacken\\. Onwards and upwards for the MNFT token\\!'

const contractMessage = '*Polygon:* [0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB](https://polygonscan.com/address/0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB) \n'+
    '*BSC:* [0x33BE7644c0E489b3A0c639D103392D4F3e338158](https://bscscan.com/address/0x33BE7644c0E489b3A0c639D103392D4F3e338158) \n'+
    '*Velas:* [0x4cBA3447E51239065310E24c02C190945ad761d9](https://evmexplorer.velas.com/address/0x4cBA3447E51239065310E24c02C190945ad761d9/)'
    
const tradeMessage = '*make sure to have the slippage set to 6%*\n' +
    '[*Swap on Pancake*](https://pancakeswap.finance/swap?outputCurrency=0x33BE7644c0E489b3A0c639D103392D4F3e338158) \n'+
    '[*Swap on Quickswap*](https://quickswap.exchange/#/swap?outputCurrency=0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB) \n'+
    '[*Trade on Ascendex*](https://ascendex.com/en/basic/cashtrade-spottrading/usdt/mnft)'

const bridgeMessage='[*Velas <\\-\\> BSC*](https://bridge.velaspad.io/#contract) \n'+
    '[*Polygon <\\-\\> BSC*](https://bridge.terablock.com)'
const claimMessage='The Claim portal allows users to claim their private sale allocations\\. This includes whitelisted allocations and Manga owners allocations who completed the required tasks\\.\n\n'+
    '[*claim\\.baddays\\.io*](https://claim.baddays.io) \n\n'+
    '*More info:*\n'+
    '[marvelousnfts\\.com](https://marvelousnfts.com/news-detail?n_id=231)'

const feedbackMessage='Thanks for playing Baddays\\.io the Beta\\! As we continue to balance and improve your feedback is important\\.\n\n'+
    '*Please leave your feedback below:* \n'+
    '[google feedback form](https://forms.gle/XVCYm6gZxuofEBNX6)'

const discordMessage='Don’t miss the BadDays Character Hunt over on discord\\! Daily challenges and events to keep you busy and earn some BDC vouchers\\!\n\n'+
    '*Join today and see our International community rooms including Turkish, Chinese and more\\!* \n'+
    '[baddays discord](https://discord.gg/3XcqFbGP8m)'

const taxMessage='*5% transaction fee* composed as follow: \n' +
    '*1%* burn \n'+
    '*2%* distributed to staking pool\n'+
    '*1%* liquidity reserve \n'+
    '*1%* season battle rewards'

initializeBot = function() {
    /*
    commands - shows all commands
    price - shows a ticker image with the current price
    contract - shows the contracts and links
    trade - shows the links to trading platforms
    bridge - shows the links to the bridges
    audit - shows the audit link
    claim - shows the MNFT claim link
    discord - shows the link to our discord
    fee - shows what happens with the tx fees
    feedback - shows the link to the google feedback form
    */

    bot.start((ctx) => {
        ctx.replyWithPhoto({source: './assets/baddays.jpg'}, {caption: 
            '*This is the baddays bot\\!*\n' +
            commandsMessage,
        parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })
    bot.command("commands", (ctx) => {
        ctx.replyWithPhoto({source: './assets/baddays.jpg'}, {caption: 
            commandsMessage,
        parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })
    bot.command("price", (ctx) => {
        replyWithMNFTTokenTickerImage(ctx)
    })
    bot.command("audit", (ctx) => {
        ctx.replyWithPhoto({source: './assets/audit.jpg'}, {caption: 
            auditMessage,
        parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })
    bot.command("contract", (ctx) => {
        ctx.replyWithPhoto({source: './assets/contracts.jpg'}, {caption: 
            contractMessage,
        parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })
    bot.command("trade", (ctx) => {
        // ask bsc/polyon(matic)/velas/cex
        ctx.replyWithPhoto({source: './assets/trading.jpg'}, {caption: 
            tradeMessage,
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    
    })
    bot.command("bridge", (ctx) => {
        ctx.replyWithPhoto({source: './assets/bridges.jpg'}, {caption: 
            bridgeMessage,
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })

    bot.command("claim", (ctx) => {
        ctx.replyWithPhoto({source: './assets/claim.jpg'}, {caption: 
            claimMessage,
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })

    bot.command("feedback", (ctx) => {
        ctx.replyWithPhoto({source: './assets/feedback.jpg'}, {caption: 
            feedbackMessage,
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })

    bot.command("discord", (ctx) => {
        replyWithBasicTextTickerImage(ctx, 'baddays discord', '', { 
            caption: discordMessage,
            parse_mode: "MarkdownV2", disable_web_page_preview: true})
    })

    bot.command("fee", (ctx) => {
        replyWithBasicTextTickerImage(ctx, 'MNFT fees', '', { 
            caption: taxMessage,
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

function replyWithBasicTextTickerImage(ctx, caption, value, message) {
    replyWithScreenshot(ctx, createBasicTextTickerUrl(caption, value), message)
}

function replyWithMNFTTokenTickerImage(ctx) {
    replyWithScreenshot(ctx, createCoingeckoPriceTickerUrl('marvelous-nfts', 1, 'usd'))
}

function replyWithScreenshot(ctx, url, caption = null) {
    puppeteerBrowser.newPage().then(async page => {
        // page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
        page.goto(url, {"waitUntil" : "networkidle0"}).then(async () => {
            page.screenshot().then(screenshot => {
                caption === null ? ctx.replyWithPhoto({source: screenshot}) : ctx.replyWithPhoto({source: screenshot}, caption) 
                page.close();
            })
        })
    })
}