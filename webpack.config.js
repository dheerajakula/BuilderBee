const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const commonConfig = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};

const mainConfig = {
  ...commonConfig,
  name: 'main',
  target: 'electron-main',
  entry: './src/main/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const preloadConfig = {
  ...commonConfig,
  name: 'preload',
  target: 'electron-preload',
  entry: './src/main/preload.ts',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const engineConfig = {
  ...commonConfig,
  name: 'engine',
  target: 'web',
  entry: './src/engine/index.ts',
  output: {
    filename: 'engine.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/engine/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 9000,
    hot: true,
    static: {
        directory: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
};

module.exports = [mainConfig, preloadConfig, engineConfig];