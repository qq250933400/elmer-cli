const path = require('path');
const merge = require('webpack-merge');
// 引入通用webpack配置文件
const common = require("./webpack.common");
const webpack = require("webpack");

// const Dashboard = require("webpack-dashboard");
// const DashboardPlugin = require("webpack-dashboard/plugin");
// const dashboard = new Dashboard();

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");

const port = 3000;

module.exports = merge(common, {
    // 使用 source-map
    devtool: 'source-map',
    // 对 webpack-dev-server 进行配置
    devServer: {
        contentBase: './dist',
        // 设置localhost端口
        port: port,
        // 自动打开浏览器
        open: false,
        quiet: false,
        hot: true,
        inline: true,
        host:"0.0.0.0"
    },
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.min.js'
    },
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    watchOptions: {
        ignored: /node_modules/
    }
});
