const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const getConfig = require('./config')
const checker = require('./checker')

module.exports = config => new Promise((resolve, reject) => {
  global.console.info('building...')

  const { port = 2222, mode = 'production' } = config
  const compiler = webpack(getConfig(config))

  if (mode === 'production') {
    compiler.run((err, stats) => {
      if (err) {
        global.console.error(err.stack || err)
        if (err.details) {
          global.console.error(...err.details)
        }
        reject(new Error('webpack config error'))
        return
      }

      const info = stats.toJson('minimal')

      if (stats.hasErrors()) {
        global.console.error(...info.errors)
        reject(new Error('webpack build error'))
        return
      }

      if (stats.hasWarnings()) {
        global.console.warn(...info.warnings)
      }

      resolve(stats.toJson('normal'))
    })
  } else {
    try {
      compiler.hooks.done.tapAsync('done', checker.bind(config))

      const devServer = new WebpackDevServer(compiler, {
        disableHostCheck: true,
        contentBase: config.tmpDir,
        port,
        host: '0.0.0.0',
        stats: 'minimal',
        hot: true,
        inline: true,
      })
      devServer.listen(port)
      global.console.info(`server running: http://127.0.0.1:${port}`)

      resolve({ server: devServer })
    } catch (e) {
      reject()
    }
  }
})
