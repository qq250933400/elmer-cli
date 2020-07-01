import staticObj from "./static";
var createPackage = require("./createPackage").default;
var shelljs = require("shelljs");
var path = require("path");
var color = require("cli-color");

export default (options) => {
    const rootPath = staticObj.getNewProjectFolder(options.name);// 获取创建项目位置
    const sourcePath = staticObj.getSourcePath(options);
    let existsPJ = false;
    if(staticObj.exists(rootPath)) {
        existsPJ = !staticObj.emptyFolder(rootPath);
        if(existsPJ) {
            console.log(color.red(`[ERR] 创建失败：项目路径已存在并且不是空目录(${rootPath})。`));
           return;
        }
    } else {
        staticObj.mkdir(rootPath);
    }
    console.log(color.green("[INFO] 创建项目路径：" + rootPath));
    createPackage(rootPath, options, () => {
        let child;
        staticObj.copyFiles(sourcePath, rootPath, options.ignore);
        staticObj.createGitIgnore(path.resolve(rootPath, "./.gitignore"), options.gitignore);
        staticObj.createNpmIgnore(path.resolve(rootPath, "./.npmignore"), options.npmignore);
        shelljs.cd(rootPath);
        console.log(color.yellow("[Info] 安装依赖..."));
        if(options.yarn) {
            child = shelljs.exec("yarn install", {
                async: true,
                silent: false
            });
        } else {
            child = shelljs.exec("npm install", {
                async: true,
                silent: false
            });
        }
        // --- install dependencies 
        const dependencies = options.dependencies || [];
        if(dependencies.length>0) {
            console.log(color.yellow("[Info] 安装依赖包..."));
            if(options.yarn) {
                child = shelljs.exec("yarn add " + dependencies.join(" "), {
                    async: true,
                    silent: false
                });
            } else {
                child = shelljs.exec("npm i " + dependencies.join(" "), {
                    async: true,
                    silent: false
                });
            }
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
