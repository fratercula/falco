const webpack = require('webpack')
const config = require('./webpack')

webpack(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(...err.details)
    }
    return
  }

  const info = stats.toJson('minimal')

  if (stats.hasErrors()) {
    console.error(...info.errors)
    return
  }

  if (stats.hasWarnings()) {
    console.warn(...info.warnings)
  }

  console.log('done')
})
