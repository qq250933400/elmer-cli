import "colors";
import getConfig, { mergeUserConfig, TypeOverrideConfig } from "./config";
import { StaticCommon } from "elmer-common";
const merge = require('webpack-merge');
const webpack = require("webpack");
// const webpackCli = require("webpack-cli");
const buildConfig = require("../../webpack_config/webpack.config.build");

export default () => {
    const settingConfig = getConfig();

    delete settingConfig.devServer;
    
    let configuration = merge(buildConfig, settingConfig);
    let overrideConfig:TypeOverrideConfig = {};
    configuration = mergeUserConfig(configuration, overrideConfig, true);
    // const compiler = webpack(configuration);
    webpack(configuration, (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            return;
        }
        console.log(stats.toString({
            colors: true,
            env: true,
        }));
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }

        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }
    });
}