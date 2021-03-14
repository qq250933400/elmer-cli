const path = require('path');
const merge = require('webpack-merge').merge;
// 引入通用webpack配置文件
const common = require("./webpack.common");
const webpack = require("webpack");

// const Dashboard = require("webpack-dashboard");
// const DashboardPlugin = require("webpack-dashboard/plugin");
// const dashboard = new Dashboard();

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");

module.exports = merge(common, {
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
    ]
});
