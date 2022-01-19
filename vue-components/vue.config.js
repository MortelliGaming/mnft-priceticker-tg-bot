module.exports = {
    configureWebpack: (webPackConfig) => {
        webPackConfig.resolve= {
            fallback: {
              fs: false
            }
          }
    }
}