import "colors";
import getConfig from "./config";
const merge = require('webpack-merge');
const webpack = require("webpack");
const webpackCli = require("webpack-cli");
const buildConfig = require("../../webpack_config/webpack.config.build");

export default () => {
    const settingConfig = getConfig();

    delete settingConfig.devServer;
    
    const configuration = merge(buildConfig, settingConfig);console.log(configuration);
    // const compiler = webpack(configuration);
    // const cli = new webpackCli()
    // console.log(compiler);
}