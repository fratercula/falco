const { join } = require('path')
const { WORKING_DIR, BASE_DIR, EXTERNALS } = require('../config')

module.exports = (config) => {
  const {
    entry,
    esmodules = true,
    cssModule = false,
    jsSourceMap = false,
    cssSourceMap = false,
    compress = true,
    externals = {},
  } = config

  return {
    entry: entry.map(dir => join(BASE_DIR, WORKING_DIR, dir)),

    output: {
      filename: 'output.js',
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
                esmodules
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
            {
              loader: 'style-loader',
              options: {
                sourceMap: cssSourceMap,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: cssSourceMap,
                modules: cssModule,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: cssSourceMap,
              },
            },
          ],
        },
      ],
    },

    mode: compress ? 'production' : 'development',

    externals: { ...EXTERNALS, ...externals },

    devtool: jsSourceMap ? 'source-map' : false,
  }
}
