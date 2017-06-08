const merge = require('webpack-merge');

const commonConf = require('./webpack.common.config');

module.exports = merge(commonConf, {
  output: {
    filename: 'react-formkit.js',
    libraryTarget: 'umd',
  },
});
