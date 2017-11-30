const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		a: './src/app.js'
	},
	output: {
		filename: 'js/[name]-[hash:6].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: ''
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [ path.resolve(__dirname, 'node_modules') ],
				include: [ path.resolve(__dirname, 'src') ]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [require('postcss-import'), require('autoprefixer')],
						browser: ['last 5 versions']
					}
				}]
			},
			{
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'img/[name]-[hash:6].[ext]'
					}
				}]
			},
			{
				test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name]-[hash:6].[ext]'
				}
			},
			{
				test: /\.ss$/,
				use: ['style-loader', 'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [require('postcss-import'), require('autoprefixer')],
						browser: ['last 5 versions']
					}
				}, 
				'sass-loader']
			}
		]
	},
	plugins: [
		new htmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html'
		})
	],
	devServer: {
		open: true,
		port: 9000,
		contentBase: './',
		publicPath: '/'
	}
}