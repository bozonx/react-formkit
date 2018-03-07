const merge = require('webpack-merge');

const commonConf = require('./webpack.common.config');


module.exports = merge(commonConf, {
  output: {
    filename: 'react-formkit.js',
    libraryTarget: 'window',
  },
  devtool: 'source-map',
  externals: {
    'react': 'React',
    'prop-types': 'PropTypes',
  }
});
