
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
        replyWithBasicTextTickerImage(ctx, 'Polygon Contract', '0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB')         
        replyWithBasicTextTickerImage(ctx, 'BSC Contract', '0x33BE7644c0E489b3A0c639D103392D4F3e338158')         
        replyWithBasicTextTickerImage(ctx, 'Velas Contract', '0x4cBA3447E51239065310E24c02C190945ad761d9')
    })
    bot.command("trade", (ctx) => {
        // ask bsc/polyon(matic)/velas/cex
        var keyData =  ['BSC', 'Polygon', 'Velas', 'CEX'].map(item => {
            return {
                callback_data: 'trade_' + item,
                text: item,
            }
        })
        ctx.reply(`on which blockchain?`, { reply_markup: {
            inline_keyboard: [keyData],
        }});
        // pancake link
        // quickswap link
        // velas bridge link
        // ascendex link
    })
    bot.command("token", (ctx) => {
        // ask cmc / coingecko / dextools
        var keyData =  ['CMC', 'Coingecko', 'DexTools'].map(item => {
            return {
                callback_data: 'token_' + item,
                text: item,
            }
        })
        ctx.reply(`where you get your infos from?`, { reply_markup: {
            inline_keyboard: [keyData],
        }});
        // cmc link
        // coingecko link
        // ask bsc / polygon
    })

    bot.on('callback_query', (ctx) => {
        switch(ctx.callbackQuery.data.toLowerCase()) {
            case 'contract_bsc':
                ctx.reply('*BSC Contract* \n 0x33BE7644c0E489b3A0c639D103392D4F3e338158', { parse_mode: "Markdown" })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'contract_polygon':
                ctx.reply('*Polygon (Matic) Contract* \n 0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB', { parse_mode: "Markdown" })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'contract_velas':
                ctx.reply('*Velas Contract* \n 0x4cBA3447E51239065310E24c02C190945ad761d9', { parse_mode: "Markdown" })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'trade_bsc':
                ctx.reply('*PancakeSwap* \n [Swap on Pancake](https://pancakeswap.finance/swap?outputCurrency=0x33BE7644c0E489b3A0c639D103392D4F3e338158)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'trade_polygon':
                ctx.reply('*QuickSwap* \n [Swap on Quickswap](https://quickswap.exchange/#/swap?outputCurrency=0xd281aF594Cbb99E8469f3591D57A0C72EB725bdB)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'trade_velas':
                ctx.reply('*Bridge To BSC* \n [VelasPad Bridge](https://bridge.velaspad.io/#contract)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'trade_cex':
                ctx.reply('*Ascendex* \n [Trade on Ascendex](https://ascendex.com/en/basic/cashtrade-spottrading/usdt/mnft)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'token_cmc':
                ctx.reply('*CoinMarketCap* \n [Go To CoinMarketCap](https://coinmarketcap.com/currencies/marvelous-nfts-bad-days)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'token_coingecko':
                ctx.reply('*coingecko* \n [Go To coingecko](https://www.coingecko.com/en/coins/marvelous-nfts)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'token_dextools':
                var keyData =  ['BSC', 'Polygon'].map(item => {
                    return {
                        callback_data: 'token_dextools_' + item,
                        text: item,
                    }
                })
                ctx.reply(`on which blockchain?`, { reply_markup: {
                    inline_keyboard: [keyData],
                }});
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'token_dextools_bsc':
                ctx.reply('*dextools bsc pairs* \n [Go To dextools](https://www.dextools.io/app/bsc/pair-explorer/0xb3bb53f873c8fc59f0e62580b1b35802bb5688ce)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            case 'token_dextools_polygon':
                ctx.reply('*dextools polygon pairs* \n [Go To dextools](https://www.dextools.io/app/polygon/pair-explorer/0x0463302f0f9f847d2c6164525e0d966a9bdce71c)', { parse_mode: "Markdown", disable_web_page_preview: true })
                try{
                    ctx.deleteMessage();
                } catch{}
                break;
            default:
                break;
        }
        ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
        // Using context shortcut
        ctx.answerCbQuery()
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