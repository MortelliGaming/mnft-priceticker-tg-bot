
require('dotenv').config()
const VUE_PORT = (process.env.VUE_SERVER_PORT || 8080)
module.exports = {
    createCoingeckoPriceTickerUrl(tokenId, days, vsCurrency) {
        var url = 'http://localhost:'+VUE_PORT+'/coingeckopriceticker?'+
            'tokenId='+tokenId +
            '&vsCurrency='+vsCurrency +
            '&days='+days
        console.log('ticker url: ', url)
        return url;
    },
    createCoingeckoVolumeTickerUrl(tokenId, days, vsCurrency) {
        var url = 'http://localhost:'+VUE_PORT+'/coingeckovolumeticker?'+
            'tokenId='+tokenId +
            '&vsCurrency='+vsCurrency +
            '&days='+days
        console.log('ticker url: ', url)
        return url;
    },
    createCoingeckoMarketCapTickerUrl(tokenId, days, vsCurrency) {
        var url = 'http://localhost:'+VUE_PORT+'/coingeckomarketcapticker?'+
            'tokenId='+tokenId +
            '&vsCurrency='+vsCurrency +
            '&days='+days
        console.log('ticker url: ', url)
        return url;
    },
    createBasicTextTickerUrl(caption, value) {
        var url = 'http://localhost:'+VUE_PORT+'/basictextticker?'+
            'caption='+caption +
            '&value='+value
        console.log('ticker url: ', url)
        return url;
    }
}