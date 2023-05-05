const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const env = require('dotenv').config();

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup/index.js',
    background: './src/background/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contenthash:5].chunk.js'
  },
  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true
        }
      }
    }
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
    extensions: ['.*', '.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        './src/manifest.json',
        './src/pages/examples.html',
        './src/pages/examples.js',
        './assets',
        { from: './src/_locales', to: '_locales' }
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'Powerlet',
      filename: 'popup.html',
      template: './src/popup/index.ejs',
      excludeChunks: ['background'],

      // Blocking required otherwise the "options_ui" page will not load
      // because there is no visible content for Chrome to show a dialog. It's
      // a bug in Chrome.
      scriptLoading: 'blocking'
    }),
    new MiniCssExtractPlugin({
      filename: 'popup.[contenthash:5].css'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...env.parsed,
        NODE_ENV: process.env.NODE_ENV
      })
    })
  ]
};
