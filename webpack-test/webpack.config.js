const path = require('path');
const webpack = require('webpack');

const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		a: './src/app.js',
		b: './src/b.js'
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
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							name: 'img/[name]-[hash:6].[ext]'
						}
					}, 'image-webpack-loader'
				]
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
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ {
						loader: 'css-loader',
						options: {
							minimize: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [require('postcss-import'), require('autoprefixer')],
							browser: ['last 5 versions']
						}
					}],
					publicPath: '../'
				})
			},
			{
				test: /\.ss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ {
						loader: 'css-loader',
						options: {
							minimize: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [require('postcss-import'), require('autoprefixer')],
							browser: ['last 5 versions']
						}
					}, 'sass-loader' ],
					publicPath: '../'
				})
			}
		]
	},
	plugins: [
		new htmlWebpackPlugin({
			favicon: './src/favicon.ico',
			filename: 'index.html',
			template: 'src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true
			},
			chunks: [ 'a' ], /*这个可以选择entry里哪个js放进html里
			title: '这个标题可以通过htmlWebpackPlugin.options.title传给html里的title' */
		}),
		new htmlWebpackPlugin({
			favicon: './src/favicon.ico',
			filename: 'b.html',
			template: 'src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true
			},
			chunks: [ 'b' ], /*这个可以选择entry里哪个js放进html里
			title: '这个标题可以通过htmlWebpackPlugin.options.title传给html里的title' */
		}),
		new CleanWebpackPlugin(['dist']),
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
	            except: ['$super', '$', 'exports', 'require', 'module', '_']
	        },
	        compress: {
	            warnings: false
	        },
	        output: {
	            comments: false
	        }
		}),
		new ExtractTextPlugin({
			filename: 'css/[name]-[hash:6].css'
		})
	]
}