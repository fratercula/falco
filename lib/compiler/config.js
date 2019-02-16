const { join, resolve } = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const external = require('../helper/external')
const { OUTPUT } = require('../config')

module.exports = (config) => {
  const {
    entry,
    tmpDir,
    resolveModules,
    mode = 'production',
    esModules = true,
    cssModule = false,
    externals = {},
  } = config
  const modules = ['node_modules']
  const plugins = [new VueLoaderPlugin()]

  if (resolveModules) {
    modules.unshift(join(tmpDir, 'node_modules'))
  }

  if (mode === 'development') {
    entry.unshift('webpack-dev-server/client?', 'webpack/hot/dev-server')
    plugins.unshift(new webpack.HotModuleReplacementPlugin())
  }

  return {
    entry,

    context: resolve(__dirname, '../../'),

    output: {
      filename: OUTPUT,
      path: tmpDir,
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
                  ? [require.resolve('@babel/preset-env'), { targets: { esmodules: true } }]
                  : [require.resolve('@babel/preset-env'), { modules: false, useBuiltIns: 'usage' }],
                require.resolve('@babel/preset-react'),
              ],
              plugins: [
                [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                require.resolve('@babel/plugin-proposal-class-properties'),
                [require.resolve('@babel/plugin-transform-runtime'), { regenerator: false, useESModules: true }],
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
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },

    mode,

    externals: external(externals).config,

    devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

    performance: { hints: false },

    plugins,
  }
}
