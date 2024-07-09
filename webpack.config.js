const path = require('path');
const webpack = require('webpack')
const MyWebpackPlugin = require('./src/MyWebpackPlugin')
const myWebpackPlugin = new MyWebpackPlugin()

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    // filename: '[name]-[git-revision-branch]-[git-revision-version].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    myWebpackPlugin,
    new webpack.DefinePlugin({
      CONFIG: {
        COMMITHASH: JSON.stringify(myWebpackPlugin.commitHash)
      }
    })
  ]
};