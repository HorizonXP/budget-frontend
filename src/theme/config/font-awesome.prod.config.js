const fontAwesomeConfig = require('./font-awesome.dev.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
fontAwesomeConfig.styleLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader');
module.exports = fontAwesomeConfig;
