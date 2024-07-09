const path = require('path');
const MyWebpackPlugin = require('./src/MyWebpackPlugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new MyWebpackPlugin()
  ]
};