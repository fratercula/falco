const { resolve } = require('path')
const defaultExternals = require('./externals')

const base = {
  output: {
    filename: 'output.js',
    path: resolve(__dirname, '../context')
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
          }
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
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

  devtool: 'source-map',
}

module.exports = (config) => {
  const {
    entry,
    compress,
    externals,
  } = config

  base.mode = compress ? 'production' : 'development'
  base.externals = { ...defaultExternals, ...externals }
  base.entry = entry

  return base
}
