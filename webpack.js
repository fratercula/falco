module.exports = {
  entry: ['./test.js', './test1.js'],

  output: {
    filename: 'output.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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

  mode: 'production',
  // mode: 'development',

  resolve: {
    extensions: ['.js'],
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  devtool: 'source-map',
}
