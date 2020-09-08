import { getCommand, StaticCommon } from "elmer-common/lib/BaseModule/StaticCommon";
import staticObj from "../static";
import "colors";

const merge = require('webpack-merge');
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const initConfiguration = () => {
    const rootPath = process.cwd();
    const tsConfig = path.resolve(rootPath, "tsconfig.json");
    const srcConfig = path.resolve(__dirname, "../../tsconfig.json");
    const babelrc = path.resolve(rootPath, ".babelrc");
    const srcBabelrc = path.resolve(rootPath, ".babelrc");
    // --- check tsconfig, if not exists then copy tsconfig.json to project folder
    if(!staticObj.exists(tsConfig)) {
        if(staticObj.exists(srcConfig)) {
            const srcValue = staticObj.readFile(srcConfig);
            staticObj.writeFile(tsConfig, srcValue);
        }
    }
    if(!staticObj.exists(babelrc)) {
        if(staticObj.exists(srcBabelrc)) {
            const srcBabelValue = staticObj.readFile(srcBabelrc);
            staticObj.writeFile(babelrc, srcBabelValue);
        }
    }
};

export type TypeOverrideConfig = {
    template?: string;
    entry?: string;
    build?: string;
    development?: string;
};

/**
 * 合并用户自定义配置
 * @param configuration elmer-cli 配置的参数
 * @param overridConfig 需要覆盖elmer-cli的参数
 * @param isBuild 当前执行模式是否是打包模式
 */
export const mergeUserConfig = (configuration:any, overridConfig: TypeOverrideConfig, isBuild: boolean = false): void => {
    const rootPath = process.cwd();
    const packageFile = path.resolve(rootPath, "./package.json");
    if(staticObj.exists(packageFile)) {
        const configJSONStr:string = staticObj.readFile(packageFile);
        if(!staticObj.isEmpty(configJSONStr)) {
            const configJSON = JSON.parse(configJSONStr);
            let configFile = configJSON["elmer-cli-webpack-config"];
            if(!StaticCommon.isEmpty(configFile)) {
                if(StaticCommon.isString(configFile)) {
                    configFile = path.resolve(rootPath, configFile);
                    console.log(`[Log] 合并自定义配置: ${configFile}`.green);
                    if(staticObj.exists(configFile)) {
                        const obj = require(configFile);
                        return merge(configuration, obj);
                    } else {
                        console.log("[Err] 合并配置失败".red);
                    }
                } else if(StaticCommon.isObject(configFile)) {
                    const overrideConfigData: TypeOverrideConfig = configFile;
                    if(!StaticCommon.isEmpty(overrideConfigData.template)) {
                        overridConfig.template = overrideConfigData.template;
                    }
                    if(!StaticCommon.isEmpty(overrideConfigData.entry)) {
                        overridConfig.template = overrideConfigData.entry;
                    }
                    if(!isBuild) {
                        if(!StaticCommon.isEmpty(overrideConfigData.development)) {
                            const developFile = path.resolve(rootPath, overrideConfigData.development);
                            if(staticObj.exists(developFile)) {
                                return merge(configuration, require(developFile));
                            }
                        }
                    } else {
                        if(!StaticCommon.isEmpty(overrideConfigData.build)) {
                            const buildFile = path.resolve(rootPath, overrideConfigData.build);
                            if(staticObj.exists(buildFile)) {
                                return merge(configuration, require(buildFile));
                            }
                        }
                    }
                    
                }
            }
        }
    }
    return configuration;
}

export const portIsOccupied = (port, callback) => {
    callback(true);
}


export default () => {
    const rootPath = process.cwd();
    const templateFile = getCommand(process.argv, "-t") || getCommand(process.argv, "--template");
    const entryJS = getCommand(process.argv, "-e") || getCommand(process.argv, "--entry");
    const port = getCommand(process.argv, "port");
    const base = getCommand(process.argv, "-b") || getCommand(process.argv,"--base");
    initConfiguration();
    return {
        devServer: {
            contentBase: !StaticCommon.isEmpty(base) ? path.join(rootPath, base) : path.join(rootPath, './src'),
            overlay: true,
            open: false,
            hot: true,
            compress: true,
            quiet: false,
            inline: true,
            port: StaticCommon.isNumeric(port) && parseInt(port.toString(), 10) > 0 ? port : 3000,
            host: '0.0.0.0',
        },
        plugins: [
            new htmlWebpackPlugin({
                filename: "index.html",
                template: StaticCommon.isEmpty(templateFile) ? "./public/index.html" : templateFile,
                inject: true,
                hash: true,
                title: "Document",
                minify:{
                    removeComments:true //是否压缩时 去除注释
                }
            }),
        ],
        entry: {
            "./script/main": StaticCommon.isEmpty(entryJS) ? "./public/index.js" : entryJS,
        }
    }
}