const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConf = require('./webpack.common.config');


module.exports = merge(commonConf, {
  output: {
    filename: 'react-formkit-web.min.js',
    libraryTarget: 'window',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ],
});
