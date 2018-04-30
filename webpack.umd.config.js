const merge = require('webpack-merge');

const commonConf = require('./webpack.common.config');


module.exports = merge(commonConf, {
  output: {
    filename: 'react-formkit.umd.js',
    libraryTarget: 'umd',
  },
});
