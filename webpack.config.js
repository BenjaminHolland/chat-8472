module.exports = {
  entry: './react/Main.js',
  output: {
    path: './',
    filename:'./public/static/webpack.bundle.js',
  
  },
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
