const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              attrs: false
            }
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'to-string-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              root: '/',
              url: false,
            }
          }
        ]
      },
    ]
  }
}