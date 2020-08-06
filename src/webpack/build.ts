import "colors";
import getConfig from "./config";
const merge = require('webpack-merge');
const webpack = require("webpack");
// const webpackCli = require("webpack-cli");
const buildConfig = require("../../webpack_config/webpack.config.build");

export default () => {
    const settingConfig = getConfig();

    delete settingConfig.devServer;
    
    const configuration = merge(buildConfig, settingConfig);
    console.log("Configuration: ",configuration);
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