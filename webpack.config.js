var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
		path: 'dist',
		filename: 'main.js'
	},
  plugins: [
    new HtmlWebpackPlugin({template: './src/template.html'}),
    new CopyWebpackPlugin([{ from: 'components/data' }])
  ],
  module: {
    loaders: [
      {
				test: /.js?$/,
        loader: 'babel-loader',
				include: [
          path.resolve(__dirname, "api"),
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "src/utils"),
          path.resolve(__dirname, "components"),
          path.resolve(__dirname, "models"),
          path.resolve(__dirname, "store"),
          path.resolve(__dirname, "test")
        ],
        query: {
					plugins: ['transform-runtime'],
          presets: ['es2015']
        },
      },
			{ test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
};
