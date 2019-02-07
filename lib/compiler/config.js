const { join } = require('path')
const { WORKING_DIR, BASE_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry,
    output,
    resolveModules,
    mode = 'production',
    moduleRules = [],
    esModules = true,
    cssModule = false,
    externals = {},
    port = 2222,
  } = config
  const modules = ['node_modules']

  if (resolveModules) {
    modules.unshift(join(BASE_DIR, WORKING_DIR, 'node_modules'))
  }

  if (mode === 'development') {
    entry.unshift(`webpack-dev-server/client?http://127.0.0.1:${port}`)
  }

  return {
    entry,

    output: {
      filename: output,
      path: join(BASE_DIR, WORKING_DIR),
    },

    resolve: {
      modules,
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                esModules
                  ? ['@babel/preset-env', { targets: { esmodules: true } }]
                  : ['@babel/preset-env', { modules: false, useBuiltIns: 'usage' }],
                '@babel/preset-react',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-transform-runtime', { regenerator: false, useESModules: true }],
              ],
            },
          },
        },
        {
          test: /\.(css|less)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: cssModule,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'less-loader',
              options: { javascriptEnabled: true },
            },
          ],
        },
      ].concat(moduleRules),
    },

    mode,

    externals,

    devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

    performance: { hints: false },
  }
}
