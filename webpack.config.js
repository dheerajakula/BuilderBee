const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const commonConfig = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
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
    extensions: ['.ts', '.tsx', '.js', '.jsx']
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
    host: 'localhost',
    compress: true,
    static: false,
    hot: 'only',
    devMiddleware: {
      publicPath: '/',
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        if (res.headersSent) {
          return;
        }
        next();
      });
      return middlewares;
    }
  }
};

module.exports = [mainConfig, preloadConfig, engineConfig];