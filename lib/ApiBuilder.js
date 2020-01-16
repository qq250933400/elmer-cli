const static = require("./Static");
const color = require("cli-color");
const createPackage = require("./CreatePackage");
const shelljs = require("shelljs");

module.exports = (options) => {
    const rootPath = static.getNewProjectFolder(options.name);// 获取创建项目位置
    const sourcePath = static.getSourcePath(options);
    let existsPJ = false;
    if(static.exists(rootPath)) {
        existsPJ = !static.emptyFolder(rootPath);
        if(existsPJ) {
            console.log(color.red(`[ERR] 创建失败：项目路径已存在并且不是空目录(${rootPath})。`));
           return;
        }
    } else {
        static.mkdir(rootPath);
    }
    console.log(color.green("[INFO] 创建项目路径：" + rootPath));
    createPackage(rootPath, options, () => {
        let child;
        static.copyFiles(sourcePath, rootPath, options.ignore);
        shelljs.cd(rootPath);
        console.log(color.yellow("[Info] 安装依赖..."));
        if(options.yarn) {
            child = shelljs.exec("yarn install", {
                async: true
            });
        } else {
            child = shelljs.exec("npm install", {
                async: true
            });
        }
        child.on("close", (code, sj) => {
            console.log(color.green("[Info] Complete!"));
        });
        child.on("message", (message) => {
            console.log(color.white("[LOG] " + message));
        });
        child.on("error", (err) => {
            console.log(color.red("[ERR] " + err.message), err.stack);
        });
        child.on("exit", () => {
            console.log("exit");
        });
    });
}
