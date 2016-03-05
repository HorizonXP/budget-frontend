'use strict';
require('babel-core/register');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const assetsPath = path.resolve(__dirname, '../static/frontend');
const host = (process.env.HOST || 'localhost');
const port = parseInt(process.env.PORT) + 1 || 3001;

const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin')

const webpack_isomorphic_tools_plugin = 
  // webpack-isomorphic-tools settings reside in a separate .js file 
  // (because they will be used in the web server code too).
  new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools'));

const babelrc = fs.readFileSync('./.babelrc');
let babelrcObject = {};

try {
    babelrcObject = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}

babelrcObject.plugins = babelrcObject.plugins || [];
if (babelrcObject.plugins.indexOf('react-transform') < 0) {
  babelrcObject.plugins.push([
    'react-transform',
    {
      transforms: [
        {
          transform: "react-transform-hmr",
          imports: ["react"],
          locals: ["module"]
        }
      ]
    }
  ]);
}

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: [
    'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
    'bootstrap-loader',
    'font-awesome-webpack!./src/theme/config/font-awesome.dev.config.js',
    './bin/client/index.js'
  ],

  output: {
    path: assetsPath,
    filename: 'js/[name]-[hash].js',
    chunkFilename: 'js/[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/static/frontend/'
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'NODE_PATH': JSON.stringify(path.join(__dirname, '..', 'src')),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    webpack_isomorphic_tools_plugin.development()
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelrcObject), 'eslint-loader']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss!less?outputStyle=expanded&sourceMap' },
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss!sass?outputStyle=expanded&sourceMap' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: webpack_isomorphic_tools_plugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },

  postcss: [ autoprefixer ],

};
