
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const color = require("cli-color");

const getNewProjectFolder = (projectName) => {
    const filePath = path.resolve("./" + projectName);
    return filePath;
};

const inputProjectInfo = (fn) => {
    const colorFn = color.cyan;
    inquirer.prompt([
        {
            type: "input",
            name: "version",
            default: "1.0.0",
            message: colorFn("请输入版本,默认(1.0.0)  >>> "),
            validate: (value) => {
                return isEmpty(value) || /^[0-9]{1,}\.[0-9]{1,}\.[0-9]{1,}$/.test(value);
            }
        }, {
            type: "input",
            name: "description",
            message: colorFn("请输入项目描述  >>> ")
        }, {
            type: "list",
            name: "license",
            message: colorFn("请选择开源许可证"),
            choices: ["ISC", "Apache", "MIT", "BSD", "GPL", "Mozilla", "LGPL"]
        }, {
            type: "input",
            name: "author",
            message: colorFn("请输入邮箱 >>> "),
            validate: (value) => {
                return isEmpty(value) || /^([a-z0-9]{1,}[a-z0-9\_\-\/\.]*)\@([0-9a-z\_\-\.]*[0-9a-z]{1,}\.([a-z]{1,}))$/.test(value);
            }
        }
    ]).then((params) => {
        typeof fn === "function" && fn(params);
    });
};
const isEmpty = (val) => {
    return undefined === val || null === val || (typeof val ==="string" && val.length <= 0);
};
const exists = (fileName) => {
    return fs.existsSync(fileName);
};
const emptyFolder = (pathStr) => {
    if(!exists(pathStr)) {
        return true;
    } else {
        const ls = fs.readdirSync(pathStr);
        return !ls || ls.length <= 0;
    }
};
const mkdir = (pathStr) => {
    if(!isEmpty(pathStr) && !exists(pathStr)) {
        fs.mkdirSync(pathStr);
        return true;
    } else {
        return false;
    }
};
const getSourcePath = (options) => {
    const sourcePath = options.sourcePath;
    const sourceRoot = path.resolve(__dirname, "../config");
    const sourcePathR = path.resolve(sourceRoot, sourcePath);
    return sourcePathR;
}
const isFile = (fileName) => {
    if(exists(fileName)) {
        const lstat = fs.lstatSync(fileName);
        return lstat.isFile();
    } else {
        return false;
    }
}
const readFile = (fileName) => {
    if(isFile(fileName)) {
        return fs.readFileSync(fileName, "utf8");
    }
}
/**
 * 扫描目录
 * @param {string} folder 指定目录
 * @param {object} fn 文件扫描回调函数
 * @param {object} folderFn 文件夹项回调函数
 */
const scanFolder = (folder, fn, folderFn) => {
    const list = fs.readdirSync(folder);
    if(list && list.length > 0) {
        list.map((item) => {
            const fileName = !/\/$/.test(folder) && !/^\//.test(item) ? folder + "/" + item : (folder + item).replace(/\/\//g, "/");
            if(isFile(fileName)) {
                typeof fn === "function" && fn({
                    path: folder,
                    name: item,
                    fileName
                });
            } else {
                typeof folderFn === "function" && folderFn({
                    path: folder,
                    name: item,
                    fileName
                })
                scanFolder(fileName, fn, folderFn);
            }
        });
    }
}
/**
 * 复制资源文件到目标文件夹
 * @param {string} sourceFolder  源文件夹
 * @param {string} toFolder 目标文件夹
 * @param {RegExp[]} ignoreList 忽略的文件规则，
 */
const copyFiles = (sourceFolder, toFolder, ignoreList) => {
    let fSource = sourceFolder.replace(/\\/g, "/");
    let ignoreCheck = (checkValue) => {
        if(ignoreList && ignoreList.length > 0) {
            for(let i = 0;i < ignoreList.length; i++) {
                let rule = ignoreList[i];
                if(Object.prototype.toString.call(rule) === "[object RegExp]") {
                    if(rule.test(checkValue)) {
                        return true;
                    }
                } else {
                    if(rule === checkValue) {
                        return true;
                    }
                }
            }
        }
    };
    scanFolder(sourceFolder, (data) => {
        const sourcePath = data.path.replace(/\\/g, "/");
        const descRelativePath = sourcePath.replace(fSource, "");
        const descFolder = path.resolve(toFolder, "./" + descRelativePath);
        const descFile = descFolder + "/" + data.name;
        const sourceFile = data.path + "/" + data.name;
        const ignore = ignoreCheck(sourceFile);
        if(!ignore && exists(descFolder)) {
            fs.copyFileSync(sourceFile, descFile);
            console.log(color.green("[Copy] " + descFile));
        } else {
            console.log(color.yellow("[Ignore] " + sourceFile));
        }
    }, (evt) => {
        const sPath = evt.path.replace(/\\/g, "/");
        const dLPath = sPath.replace(fSource, "");
        const dLFolder = /^\//.test(dLPath) ? path.resolve(toFolder, "." + dLPath) : path.resolve(toFolder, "./" + dLPath);
        const dLFolerName = dLFolder + "/" + evt.name;
        const ignore = ignoreCheck(evt.path + "/" + evt.name);
        if(!ignore) {
            if(!exists(dLFolerName)) {
                mkdir(dLFolerName);
            }
        }
    });
};
/**
 * 写入文件
 * @param {*} fileName [string]写入文件名
 * @param {*} data [any] 写入文件数据
 * @param {*} options [WriteFileOptions]
 */
const writeFile = fs.writeFileSync;

module.exports = {
    copyFiles,
    getNewProjectFolder,
    inputProjectInfo,
    isEmpty,
    exists,
    emptyFolder,
    mkdir,
    getSourcePath,
    readFile,
    isFile,
    writeFile,
    scanFolder
};
