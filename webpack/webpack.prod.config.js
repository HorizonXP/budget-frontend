'use strict';
require('babel-core/register');
// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const strip = require('strip-loader');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const autoprefixer = require('autoprefixer');

const relativeAssetsPath = '../static/frontend';
const assetsPath = path.join(__dirname, relativeAssetsPath);

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'vendor': [
      'react',
      'react-dom',
      'react-bootstrap',
      'react-router',
      'react-router-bootstrap',
      'react-router-redux',
      'redux',
      'redux-effects'
    ],
    'main': [
      'babel-polyfill',
      'bootstrap-loader/extractStyles',
      'font-awesome-webpack!./src/theme/config/font-awesome.prod.config.js',
      './bin/client/index.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: 'js/[name]-[hash].js',
    chunkFilename: 'js/[name]-[chunkhash].js',
    publicPath: 'https://' + process.env.AWS_STORAGE_BUCKET_NAME + '.s3.amazonaws.com/static/frontend/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
      { test: /\.js?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!postcss!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!postcss!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=fonts/[name].[ext]" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=img/[name].[ext]" },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240&name=img/[name].[ext]' }
    ]
  },
  postcss: [ autoprefixer ],
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: path.resolve(__dirname, '..') }),
    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('css/[name]-[hash].css', {allChunks: true}),
    new CopyWebpackPlugin([
      { from: 'static' }
    ]),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // set global consts
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production'),
        NODE_PATH: JSON.stringify(path.join(__dirname, '..', 'src')),
      }
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: '',
      sourceMap: false
    }),
    webpackIsomorphicToolsPlugin
  ]
};

