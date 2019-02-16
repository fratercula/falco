const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const logger = require('@acyort/logger')('falco')
const getConfig = require('./config')

module.exports = config => new Promise((resolve, reject) => {
  logger.info('building...')

  const { port = 2222, mode = 'production' } = config
  const compiler = webpack(getConfig(config))
  const devServerConfig = {
    disableHostCheck: true,
    contentBase: config.tmpDir,
    port,
    host: '0.0.0.0',
    stats: 'minimal',
    hot: true,
    inline: true,
  }
  const watcher = (err, stats) => {
    if (err) {
      logger.error(err.stack || err)
      if (err.details) {
        logger.error(...err.details)
      }
      reject(new Error('webpack config error'))
      return
    }

    const info = stats.toJson('minimal')

    if (stats.hasErrors()) {
      logger.error(...info.errors)
      reject(new Error('webpack build error'))
      return
    }

    if (stats.hasWarnings()) {
      logger.warn(...info.warnings)
    }

    resolve()
  }

  if (mode === 'production') {
    // compiler.apply(new webpack.ProgressPlugin((p, m) => {
    //   logger.info(`${p.toFixed(2) * 100}% ${m}`)
    // }))
    compiler.run(watcher)
  } else {
    try {
      const devServer = new WebpackDevServer(compiler, devServerConfig)
      devServer.listen(port)
      logger.info(`server running: http://127.0.0.1:${port}`)
      resolve()
    } catch (e) {
      reject()
    }
  }
})
