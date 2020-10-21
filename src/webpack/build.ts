import "colors";
import getConfig, { mergeUserConfig, TypeOverrideConfig, getOverrideConfig } from "./config";
import { StaticCommon } from "elmer-common";

const merge = require('webpack-merge');
const webpack = require("webpack");
const buildConfig = require("../../webpack_config/webpack.config.build");
const path = require("path");

export default () => {
    const settingConfig = getConfig();

    delete settingConfig.devServer;
    
    let configuration = merge(buildConfig, settingConfig);
    let overrideConfigData:TypeOverrideConfig = {};
    let overrideConfig = getOverrideConfig();
    configuration = mergeUserConfig(configuration, overrideConfigData, true);
    if(overrideConfig) {
        configuration.plugins.map((plugin) => {
            const className = StaticCommon.getValue(plugin, "__proto__.constructor.name")
            if(className === "ExtractTextPlugin" && /\.css$/.test(plugin.filename)) {
                if(undefined !== overrideConfig.hash && !overrideConfig.hash) {
                    plugin.filename = plugin.filename.replace(/\[chunkhash\:[0-9]{1,}\]/,"");
                }
            }
        });
        if(undefined !== overrideConfig.hash && !overrideConfig.hash) {
            configuration.output = {
                path: path.resolve(process.cwd(),'./dist'),
                filename: '[name].bundle.min.js',
                chunkFilename: '[name].[id].js',
                publicPath: "",
                globalObject: "this",
            };
        }
    }
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