const { resolve } = require('path')
const defaultExternals = require('./externals')
const { WORKING_DIR } = require('../config')

const base = {
  output: {
    filename: 'output.js',
    path: resolve(__dirname, `../../${WORKING_DIR}`),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
}

module.exports = (config) => {
  const {
    entry,
    sourceMap = false,
    compress = true,
    externals = {},
  } = config

  base.mode = compress ? 'production' : 'development'
  base.externals = { ...defaultExternals, ...externals }
  base.entry = entry.map(d => resolve(__dirname, `../../${WORKING_DIR}/${d}`))
  base.devtool = sourceMap ? 'source-map' : false

  return base
}
