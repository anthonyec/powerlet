const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

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
        include: APP_DIR,
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        include: MONACO_DIR,
        use: ['file-loader']
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
      title: 'Powerlets',
      filename: 'popup.html',
      template: './src/popup/index.ejs',
      excludeChunks: ['background']
    }),
    new MiniCssExtractPlugin({
      filename: 'popup.[contentHash:5].css',
      allChunks: true
    }),
    new MonacoWebpackPlugin({
      languages: ['javascript']
    })
  ]
};
