const { join, resolve } = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')
const external = require('../helper/external')
const { OUTPUT, JS_EXTENSIONS } = require('../config')

module.exports = (config) => {
  const {
    entry,
    tmpDir,
    isVue,
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

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: join(tmpDir, 'node_modules/.cache/terser-webpack-plugin'),
          parallel: true,
          sourceMap: true,
        }),
      ],
    },

    resolve: {
      modules,
      extensions: JS_EXTENSIONS.concat('vue').map(ext => `.${ext}`),
    },

    module: {
      rules: [
        {
          // test: /\.(js|jsx|ts|tsx)$/,
          test: new RegExp(`\\.(${JS_EXTENSIONS.join('|')})$`),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                require.resolve('@babel/preset-typescript'),
                esModules
                  ? [require.resolve('@babel/preset-env'), { targets: { esmodules: true } }]
                  : [require.resolve('@babel/preset-env'), { modules: false, useBuiltIns: 'usage' }],
                isVue
                  ? require.resolve('@vue/babel-preset-jsx')
                  : require.resolve('@babel/preset-react'),
              ],
              plugins: [
                [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                require.resolve('@babel/plugin-proposal-class-properties'),
                [require.resolve('@babel/plugin-transform-runtime'), {
                  regenerator: false,
                  useESModules: true,
                  // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/index.js#L41
                  absoluteRuntime: resolve(__dirname, '../../node_modules/@babel/runtime'),
                }],
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
