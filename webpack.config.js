const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    chunkFilename: '[name].[contentHash:5].chunk.js'
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      './src/manifest.json',
      './src/pages/examples.html',
      './assets'
    ]),
    new HtmlWebpackPlugin({
      title: 'Powerlet',
      filename: 'popup.html',
      template: './src/popup/index.ejs',
      excludeChunks: ['background']
    }),
    new MiniCssExtractPlugin({
      filename: 'popup.[contentHash:5].css',
      allChunks: true
    })
  ]
};
