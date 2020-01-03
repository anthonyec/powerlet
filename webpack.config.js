const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup/index.js',
    background: './src/background/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    namedModules: true,
    namedChunks: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new CopyPlugin([
      './src/manifest.json',
      './src/pages/examples.html',
      './assets'
    ]),
    new HtmlWebpackPlugin({
      title: 'Powerlets',
      filename: 'popup.html',
      template: './src/popup/index.ejs',
      excludeChunks: ['background']
    }),
    new ExtractTextPlugin({
      filename: 'popup.css',
      allChunks: true
    })
  ]
};
