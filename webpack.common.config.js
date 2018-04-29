const path = require('path');


module.exports = {
  entry: './src/formkitConnect.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'ReactFormkit',
    sourceMapFilename: '[file].map',
  },
  cache: false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDom',
  //   'prop-types': 'PropTypes',
  // }
};
