const { join, resolve } = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { WORKING_DIR, BASE_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry,
    output,
    resolveModules,
    mode = 'production',
    esModules = true,
    cssModule = false,
    externals: exts = {},
  } = config
  const modules = ['node_modules']
  const plugins = [new VueLoaderPlugin()]
  const externals = {}

  Object.keys(exts).forEach((pkg) => {
    const value = exts[pkg]
    if (Array.isArray(value)) {
      [externals[pkg]] = value
    } else {
      externals[pkg] = value
    }
  })

  if (resolveModules) {
    modules.unshift(join(BASE_DIR, WORKING_DIR, 'node_modules'))
  }

  if (mode === 'development') {
    entry.unshift('webpack-dev-server/client?', 'webpack/hot/dev-server')
    plugins.unshift(new webpack.HotModuleReplacementPlugin())
  }

  return {
    entry,

    context: resolve(__dirname, '../../'),

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

    externals,

    devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

    performance: { hints: false },

    plugins,
  }
}
