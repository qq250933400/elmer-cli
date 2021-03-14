const path = require('path');
const merge = require('webpack-merge').merge;
// 引入通用webpack配置文件
const common = require('./webpack.common.js');
const cleanWebpackPlugin = require("clean-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");
const copyWebpackPlugin = require("copy-webpack-plugin");
const ElmerWebpackPlugin = require("../lib/plugin/ElmerWebpackPlugin").ElmerWebpackPlugin;

const rootPath = process.cwd();

const webpackConfig = merge(common, {
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new cleanWebpackPlugin(
            ["css","font", "img","chunks", "scripts", "script","assets","js"],
            {
                root: path.resolve(rootPath, "./dist"),
                verbose: true,
                dry: false
            }
        ),
        new copyWebpackPlugin([{
            from: path.resolve(rootPath, "./src/assets"),
            to: path.resolve(rootPath, "./dist/assets"),
            toType: "dir"
        }]),
        new ElmerWebpackPlugin({
            remove: ["lib"]
        })
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve(process.cwd(),'./dist'),
        filename: '[name].[chunkhash:8].bundle.min.js',
        chunkFilename: 'chunks/[name].[id].[chunkhash:8].js',
        publicPath: "",
        globalObject: "this",
    },
    optimization: {
        minimize: false
    },
    mode: "production"
});

module.exports = webpackConfig;
