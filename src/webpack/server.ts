// import webpackDevServer from "webpack-dev-server";
import "colors";
import getConfig, { portIsOccupied, mergeUserConfig, TypeOverrideConfig } from "./config";
const merge = require('webpack-merge');
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const serviceConfig = require("../../webpack_config/webpack.config.dev");

export default () => {
    const settingConfig = getConfig();
    const options = settingConfig.devServer;

    delete settingConfig.devServer; // remove devServer config from setting config

    let configuration = merge(serviceConfig, settingConfig) ;
    let overrideConfig:TypeOverrideConfig = {};
    configuration = mergeUserConfig(configuration, overrideConfig, false);
    portIsOccupied(options.port, (isAvailable) => {
        if(isAvailable) {
            // console.log(configuration);return;
            webpackDevServer.addDevServerEntrypoints(configuration, options);
            const compiler = webpack(configuration);
            const server = new webpackDevServer(compiler, options);
            server.listen(options.port, 'localhost', () => {
                console.log("");
                console.log(`block dev-server listening on port ${options.port}`.blue);
                console.log("");
            });
        } else {
            throw new Error("Server port is not avaliable");
        }
    });
};