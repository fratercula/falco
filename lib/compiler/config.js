const { join, resolve } = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const getExternals = require('./externals')
const { OUTPUT, JS_EXTENSIONS } = require('../config')

module.exports = (config) => {
  const {
    entry,
    tmpDir,
    isVue,
    vue,
    targets = {},
    debug = false,
    mode,
    esModules = true,
    cssModule = false,
    output = {},
    report = false,
    installEnv,
    npmRoot,
    env,
  } = config
  const plugins = [new VueLoaderPlugin()]

  if (env) {
    plugins.push(new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env) },
    }))
  }

  if (report && mode === 'production') {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
  }

  let { sourceMap = true } = config
  let devtool = sourceMap ? 'source-map' : false

  if (mode === 'development') {
    // entry.unshift('webpack-dev-server/client?', 'webpack/hot/dev-server')
    // plugins.unshift(new webpack.HotModuleReplacementPlugin())
    output.filename = 'index.js'
    sourceMap = true
    devtool = 'cheap-module-eval-source-map'
  }

  return {
    entry,

    context: installEnv === 'global' ? resolve(__dirname, '../../') : npmRoot,

    output: {
      filename: OUTPUT,
      ...output,
      path: tmpDir,
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: join(tmpDir, 'node_modules/.cache/terser-webpack-plugin'),
          parallel: true,
          sourceMap,
        }),
      ],
    },

    resolve: {
      modules: [
        join(tmpDir, 'node_modules'),
        installEnv === 'global' ? resolve(__dirname, '../../node_modules') : npmRoot,
      ],
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
                esModules || mode === 'development'
                  ? [require.resolve('@babel/preset-env'), { targets: { esmodules: true } }]
                  : [require.resolve('@babel/preset-env'), {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 2,
                    targets,
                    debug,
                  }],
                isVue || vue
                  ? require.resolve('@vue/babel-preset-jsx')
                  : require.resolve('@babel/preset-react'),
              ],
              plugins: [
                require.resolve('@babel/plugin-transform-modules-commonjs'),
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
                sourceMap,
                modules: cssModule,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap,
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
      ],
    },

    mode: output.library !== undefined || output.libraryTarget !== undefined
      ? 'production'
      : mode,

    externals: getExternals(config),

    devtool,

    // performance: { hints: false },

    plugins,
  }
}
