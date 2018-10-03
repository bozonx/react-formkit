const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './src/formkitConnect',
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
  //   //'react-dom': 'ReactDOM',
  //   //'prop-types': 'PropTypes',
  // },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  // plugins: [
  //   // new webpack.ProvidePlugin({
  //   //   React: "React",
  //   //   react: "React",
  //   //   "window.react": "React",
  //   //   "window.React": "React",
  //   // }),
  //   new webpack.IgnorePlugin(/react/),
  // ],
  // resolve: {
  //   modules: [path.resolve('./node_modules'), path.resolve('./src')],
  //   extensions: ['.json', '.js']
  // },
};
