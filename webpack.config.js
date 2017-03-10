'use strict';
module.exports = {
  entry: './react/Main.js',
  output: {
    path: './',
    filename:'./public/static/webpack.bundle.js',
  
  },
  devServer: { contentBase: ".", host: "localhost", port: 9000 },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader:'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'react'
          ]
        }
      }
    ]
  }
}
