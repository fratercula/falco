const { join } = require('path')
const { WORKING_DIR, BASE_DIR, EXTERNALS } = require('../config')

module.exports = (config) => {
  const {
    entry,
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
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [],
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
