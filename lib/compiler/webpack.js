const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const logger = require('@acyort/logger')('falco')
const getConfig = require('./config')

module.exports = config => new Promise((resolve, reject) => {
  logger.info('webpack building...')

  const compiler = webpack(getConfig(config))

  compiler.run((err, stats) => {
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
  })
})
