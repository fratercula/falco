const { join } = require('path')
const { WORKING_DIR, BASE_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry,
    output,
    moduleRules = [],
    esModules = true,
    cssModule = false,
    externals = {},
  } = config
  const { NODE_ENV } = process.env

  return {
    entry: entry.map(dir => join(BASE_DIR, WORKING_DIR, dir)),

    devServer: {
      disableHostCheck: true,
      contentBase: join(BASE_DIR, WORKING_DIR),
      port: 8000,
      host: '0.0.0.0',
      stats: 'minimal',
    },

    output: {
      filename: output,
      path: join(BASE_DIR, WORKING_DIR),
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

    mode: NODE_ENV,

    externals,

    devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

    performance: { hints: false },
  }
}
