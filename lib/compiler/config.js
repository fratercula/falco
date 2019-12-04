const {
  join,
  resolve,
  dirname,
  extname,
} = require('path')
const { readFileSync, outputFileSync } = require('fs-extra')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const getExternals = require('./externals')
const exec = require('../helper/exec')
const { OUTPUT, JS_EXTENSIONS, TEMP_INDEX } = require('../config')

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

  let { entry } = config
  let { sourceMap = true } = config
  let devtool = sourceMap ? 'source-map' : false

  if (env) {
    plugins.push(new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env) },
    }))
  }

  if (report && mode === 'production') {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
  }

  if (mode === 'development') {
    output.filename = 'index.js'
    sourceMap = true
    devtool = 'cheap-module-eval-source-map'
  }

  const result = {
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
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap,
                modules: true,
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
          test: /\.(css|less)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap,
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

    mode: 'production',

    externals: getExternals(config),

    devtool,

    plugins,
  }

  if (mode === 'development') {
    result.mode = 'development'
    presetEnvOption.targets = 'last 1 chrome version'
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

  entry = entry.map((p, i) => {
    const currentPath = dirname(p)
    const ext = extname(p)
    const content = readFileSync(p, 'utf8')
    const targetPath = join(currentPath, TEMP_INDEX + i + ext)
    const targetContent = `import 'core-js/stable'
import 'regenerator-runtime/runtime'
${content}`

    outputFileSync(targetPath, targetContent)
    return targetPath
  })

  presetEnvOption.useBuiltIns = 'entry'
  presetEnvOption.corejs = {
    version: 3,
    proposals: true,
  }
  presetEnvOption.targets = targets

  result.entry = entry

  return result
}
