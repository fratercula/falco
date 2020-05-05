const { join, resolve } = require('path')
const { readFileSync, outputFileSync } = require('fs-extra')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const getExternals = require('./externals')
const exec = require('../helper/exec')
const {
  OUTPUT,
  JS_EXTENSIONS,
  POLYFILL_CODE,
  CWD,
} = require('../config')

module.exports = async (config) => {
  const {
    tmpDir,
    targets,
    debug,
    output,
    report,
    env,
    mode,
    loaders,
    entry,
    entrys,
    widthPolyfillEntry,
    widthPolyfillEntrys,
  } = config
  const plugins = []
  const [root] = await exec('npm root', ['!'])
  const presetEnvOption = { modules: false, debug }
  const babelLoaderPlugins = [
    require.resolve('@babel/plugin-transform-modules-commonjs'),
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
  ]

  let { sourceMap = true } = config
  let devtool = sourceMap ? 'source-map' : false
  let { context } = config

  if (!context) {
    context = __dirname.includes(root) ? resolve(root, '../') : resolve(__dirname, '../../')
  }

  if (env) {
    plugins.push(new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env) },
    }))
  }

  if (report && mode === 'production') {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
  }

  if (mode === 'development') {
    sourceMap = true
    devtool = 'cheap-module-eval-source-map'
  }

  const result = {
    entry,

    context,

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
        join(CWD, 'node_modules'),
        join(tmpDir, 'node_modules'),
        // __dirname.includes(root) ? root : resolve(__dirname, '../../node_modules'),
        join(context, 'node_modules'),
      ],
      extensions: JS_EXTENSIONS.map((ext) => `.${ext}`),
    },

    resolveLoader: {
      modules: [
        // __dirname.includes(root) ? root : resolve(__dirname, '../../node_modules'),
        join(context, 'node_modules'),
        join(CWD, 'node_modules'),
      ],
    },

    module: {
      rules: [
        {
          test: new RegExp(`\\.(${JS_EXTENSIONS.join('|')})$`),
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-typescript'),
                [require.resolve('@babel/preset-env'), presetEnvOption],
                require.resolve('@babel/preset-react'),
              ],
              plugins: babelLoaderPlugins,
              babelrc: false,
              configFile: false,
            },
          },
        },
        {
          test: /\.module\.(css|less)$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap,
                modules: true,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                sourceMap,
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.(css|less)$/,
          exclude: /\.module\.(css|less)$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap,
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                sourceMap,
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: require.resolve('svg-inline-loader'),
        },
        ...loaders,
      ],
    },

    mode: 'production',

    externals: getExternals(config),

    devtool,

    plugins,
  }

  if (mode === 'development') {
    result.mode = 'development'
    presetEnvOption.targets = { esmodules: true }
    return result
  }

  if (output.library !== undefined || output.libraryTarget !== undefined) {
    result.mode = 'production'
    babelLoaderPlugins.push([
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: targets.esmodules ? false : { version: 3, proposals: true },
        useESModules: true,
        regenerator: !targets.esmodules,
        absoluteRuntime: resolve(__dirname, '../../node_modules/@babel/runtime-corejs3'),
      },
    ])
    return result
  }

  if (targets.esmodules) {
    presetEnvOption.targets = { esmodules: true }
    return result
  }

  entrys.forEach((path, i) => {
    const origin = readFileSync(path, 'utf8')
    const content = `${POLYFILL_CODE}\n${origin}`
    outputFileSync(widthPolyfillEntrys[i], content)
  })

  presetEnvOption.useBuiltIns = 'entry'
  presetEnvOption.corejs = {
    version: 3,
    proposals: true,
  }
  presetEnvOption.targets = targets

  result.entry = widthPolyfillEntry

  return result
}
