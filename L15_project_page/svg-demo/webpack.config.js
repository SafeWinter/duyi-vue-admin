const HtmlPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin: CleanPlugin} = require('clean-webpack-plugin');

const path = require('node:path');
const svg = path.resolve(__dirname, 'src/icons');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: [ svg ],
        use: [{
          loader: 'svg-sprite-loader',
          options: {
            symbolId: 'icon-[name]'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './public/index.html',
      title: 'SVG in Action'
    }),
    new CleanPlugin()
  ],
  stats: {
    modules: false,
    builtAt: false
  }
}
