const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const getConfig = require('./config')
const checker = require('./checker')

module.exports = async (config) => {
  global.console.info('Webpack building...')

  const webpackConfig = await getConfig(config)
  const { mode } = webpackConfig
  const { port } = config
  const compiler = webpack(webpackConfig)

  return new Promise((resolve, reject) => {
    if (mode === 'production') {
      compiler.run((err, stats) => {
        if (err) {
          global.console.error(err.stack || err)
          if (err.details) {
            global.console.error(...err.details)
          }
          reject(new Error('Webpack config error'))
          return
        }

        const info = stats.toJson('minimal')

        if (stats.hasErrors()) {
          global.console.error(...info.errors)
          reject(new Error('Webpack build error'))
          return
        }

        if (stats.hasWarnings()) {
          global.console.warn(...info.warnings)
        }

        const { assets } = stats.toJson('normal')

        resolve({ assets, mode })
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
        global.console.info(`Server running: http://127.0.0.1:${port}`)

        resolve({ server: devServer, mode })
      } catch (e) {
        reject()
      }
    }
  })
}
