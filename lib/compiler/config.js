const { join, resolve } = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const getExternals = require('./externals')
const exec = require('../helper/exec')
const { OUTPUT, JS_EXTENSIONS } = require('../config')

module.exports = async (config) => {
  const {
    entry,
    tmpDir,
    targets,
    debug,
    esModules,
    cssModule,
    output,
    report,
    env,
    mode,
    loaders,
  } = config
  const plugins = []
  const [root] = await exec('npm root', ['!'])

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
    output.filename = 'index.js'
    sourceMap = true
    devtool = 'cheap-module-eval-source-map'
  }

  return {
    entry,

    context: __dirname.includes(root) ? root : resolve(__dirname, '../../'),

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
        __dirname.includes(root) ? root : resolve(__dirname, '../../node_modules'),
      ],
      extensions: JS_EXTENSIONS.map((ext) => `.${ext}`),
    },

    resolveLoader: {
      modules: [
        __dirname.includes(root) ? root : resolve(__dirname, '../../node_modules'),
        join(process.cwd(), 'node_modules'),
      ],
    },

    module: {
      rules: [
        {
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
                require.resolve('@babel/preset-react'),
              ],
              plugins: [
                require.resolve('@babel/plugin-transform-modules-commonjs'),
                [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-export-default-from'),
                [require.resolve('@babel/plugin-transform-runtime'), {
                  regenerator: false,
                  useESModules: true,
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
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
        ...loaders,
      ],
    },

    mode: output.library !== undefined || output.libraryTarget !== undefined
      ? 'production'
      : mode,

    externals: getExternals(config),

    devtool,

    plugins,
  }
}
