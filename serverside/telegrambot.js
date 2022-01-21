
const { Telegraf, Markup } = require('telegraf')
const puppeteer = require('puppeteer-extra')

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

const VUE_PORT = (process.env.VUE_SERVER_PORT || 8080)

var puppeteerBrowser = null
var currencies = []

loadAllTokens =  function() {
    loadCurrencies().then(result => {
        currencies = result
    })
}
const bot = new Telegraf(process.env.TG_BOT_TOKEN)
initializeBot = function() {
    bot.start((ctx) => ctx.reply('This is the baddays price bot type \n \n  /price  \n \n /token  \n \n /contract  \n \n /trade'))
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

    bot.command("contract", (ctx) => {
        // ask bsc/polyon(matic)/velas
        var keyData =  ['BSC', 'Polygon', 'Velas'].map(item => {
            return {
                callback_data: 'contract_' + item,
                text: item,
            }
        })
        ctx.reply(`on which blockchain?`, { reply_markup: {
            inline_keyboard: [keyData],
        }});
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
        loadAllTokens()
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
    var url = 'http://localhost:'+VUE_PORT+'/customvalueticker?'+
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