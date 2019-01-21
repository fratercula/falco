const webpack = require('webpack')
const logger = require('@acyort/logger')('falco')
const getConfig = require('./config')

module.exports = config => new Promise((resolve) => {
  webpack(getConfig(config), (err, stats) => {
    if (err) {
      logger.error(err.stack || err)
      if (err.details) {
        logger.error(...err.details)
      }
      return
    }

    const info = stats.toJson('minimal')

    if (stats.hasErrors()) {
      logger.error(...info.errors)
      return
    }

    if (stats.hasWarnings()) {
      logger.warn(...info.warnings)
    }

    resolve()
  })
})
