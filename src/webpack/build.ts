import "colors";
import getConfig, { mergeUserConfig, TypeOverrideConfig, getOverrideConfig } from "./config";
import { StaticCommon } from "elmer-common";
import { merge } from "webpack-merge";
import { webpack } from "webpack";
import * as buildConfig from "../../webpack_config/webpack.config.build";

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
            if(className === "MiniCssExtractPlugin" && /\.css$/.test(plugin.filename)) {
                if(undefined !== overrideConfig.hash && !overrideConfig.hash) {
                    let newFileName = plugin.filename.replace(/\[chunkhash\:[0-9]{1,}\]/,"");
                    newFileName = newFileName.replace(/\[hash\:[0-9]{1,}\]/,"");
                    newFileName = newFileName.replace(/\[contenthash\:[0-9]{1,}\]/,"");
                    plugin.filename = newFileName;
                }
            }
        });
        if(undefined !== overrideConfig.hash && !overrideConfig.hash) {
            configuration.output = {
                path: path.resolve(process.cwd(),'./dist'),
                filename: '[name].bundle.min.js',
                chunkFilename: 'chunks/[name].[id].js',
                publicPath: "",
                globalObject: "this",
            };
        }
        if(StaticCommon.isObject(overrideConfig.output)) {
            configuration.output = {
                ...(configuration.output || {}),
                ...overrideConfig.output
            };
        }
        if(overrideConfig.optimization) {
            configuration.optimization.minimize = true;
            configuration.mode = "production";
        }
        if(!StaticCommon.isEmpty(overrideConfig.libraryTarget)) {
            configuration.output.libraryTarget = overrideConfig.libraryTarget;
            configuration.output.library = overrideConfig.library;
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