const path = require('path');
const merge = require('webpack-merge');
// 引入通用webpack配置文件
const common = require('./webpack.common.js');
const cleanWebpackPlugin = require("clean-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const chalk = require("chalk");
const copyWebpackPlugin = require("copy-webpack-plugin");

const webpackConfig = merge(common, {
    devtool: 'cheap-module-source-map',
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                ie8: true,
            }
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new cleanWebpackPlugin(
            ["css","font", "img", "script", "assets"],
            {
                root: path.resolve(__dirname, "../dist"),
                verbose: true,
                dry: false
            }
        ),
        new copyWebpackPlugin([{
            from: path.resolve(__dirname, "../src/assets"),
            to: path.resolve(__dirname, "../dist/assets"),
            toType: "dir"
        }])
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve('dist'),
        filename: '[name].[chunkhash:8].bundle.min.js',
        chunkFilename: '[name].[id].[chunkhash:8].js',
        publicPath: "",
        globalObject: "this",
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    mode: "production"
});

module.exports = webpackConfig;
