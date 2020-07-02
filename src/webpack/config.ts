import { getCommand, StaticCommon } from "elmer-common/lib/BaseModule/StaticCommon";
import staticObj from "../static";

const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const initConfiguration = () => {
    const rootPath = process.cwd();
    const tsConfig = path.resolve(rootPath, "tsconfig.json");
    const srcConfig = path.resolve(__dirname, "../../tsconfig.json");
    // --- check tsconfig, if not exists then copy tsconfig.json to project folder
    if(!staticObj.exists(tsConfig)) {
        if(staticObj.exists(srcConfig)) {
            const srcValue = staticObj.readFile(srcConfig);
            staticObj.writeFile(tsConfig, srcValue);
        }
    }
};
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