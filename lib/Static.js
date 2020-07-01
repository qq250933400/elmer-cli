"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var inquirer = require("inquirer");
var color = require("cli-color");
var getNewProjectFolder = function (projectName) {
    var filePath = path.resolve("./" + projectName);
    return filePath;
};
var inputProjectInfo = function (fn) {
    var colorFn = color.cyan;
    inquirer.prompt([
        {
            type: "input",
            name: "version",
            default: "1.0.0",
            message: colorFn("请输入版本,默认(1.0.0)  >>> "),
            validate: function (value) {
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
            message: colorFn("请输入作者信息 >>> ")
        }
    ]).then(function (params) {
        typeof fn === "function" && fn(params);
    });
};
var isEmpty = function (val) {
    return undefined === val || null === val || (typeof val === "string" && val.length <= 0);
};
var exists = function (fileName) {
    return fs.existsSync(fileName);
};
var emptyFolder = function (pathStr) {
    if (!exists(pathStr)) {
        return true;
    }
    else {
        var ls = fs.readdirSync(pathStr);
        return !ls || ls.length <= 0;
    }
};
var mkdir = function (pathStr) {
    if (!isEmpty(pathStr) && !exists(pathStr)) {
        fs.mkdirSync(pathStr);
        return true;
    }
    else {
        return false;
    }
};
var getSourcePath = function (options) {
    var sourcePath = options.sourcePath;
    var sourceRoot = path.resolve(__dirname, "../config");
    var sourcePathR = path.resolve(sourceRoot, sourcePath);
    return sourcePathR;
};
var isFile = function (fileName) {
    if (exists(fileName)) {
        var lstat = fs.lstatSync(fileName);
        return lstat.isFile();
    }
    else {
        return false;
    }
};
var readFile = function (fileName) {
    if (isFile(fileName)) {
        return fs.readFileSync(fileName, "utf8");
    }
};
/**
 * 扫描目录
 * @param {string} folder 指定目录
 * @param {object} fn 文件扫描回调函数
 * @param {object} folderFn 文件夹项回调函数
 */
var scanFolder = function (folder, fn, folderFn) {
    var list = fs.readdirSync(folder);
    if (list && list.length > 0) {
        list.map(function (item) {
            var fileName = !/\/$/.test(folder) && !/^\//.test(item) ? folder + "/" + item : (folder + item).replace(/\/\//g, "/");
            if (isFile(fileName)) {
                typeof fn === "function" && fn({
                    path: folder,
                    name: item,
                    fileName: fileName
                });
            }
            else {
                typeof folderFn === "function" && folderFn({
                    path: folder,
                    name: item,
                    fileName: fileName
                });
                scanFolder(fileName, fn, folderFn);
            }
        });
    }
};
/**
 * 复制资源文件到目标文件夹
 * @param {string} sourceFolder  源文件夹
 * @param {string} toFolder 目标文件夹
 * @param {RegExp[]} ignoreList 忽略的文件规则，
 */
var copyFiles = function (sourceFolder, toFolder, ignoreList) {
    var fSource = sourceFolder.replace(/\\/g, "/");
    var ignoreCheck = function (checkValue) {
        if (ignoreList && ignoreList.length > 0) {
            for (var i = 0; i < ignoreList.length; i++) {
                var rule = ignoreList[i];
                if (Object.prototype.toString.call(rule) === "[object RegExp]") {
                    if (rule.test(checkValue)) {
                        return true;
                    }
                }
                else {
                    if (rule === checkValue) {
                        return true;
                    }
                }
            }
        }
    };
    scanFolder(sourceFolder, function (data) {
        var sourcePath = data.path.replace(/\\/g, "/");
        var descRelativePath = sourcePath.replace(fSource, "");
        var descFolder = path.resolve(toFolder, "./" + descRelativePath);
        var descFile = descFolder + "/" + data.name;
        var sourceFile = data.path + "/" + data.name;
        var ignore = ignoreCheck(sourceFile);
        if (!ignore && exists(descFolder)) {
            fs.copyFileSync(sourceFile, descFile);
            console.log(color.green("[Copy] " + descFile));
        }
        else {
            console.log(color.yellow("[Ignore] " + sourceFile));
        }
    }, function (evt) {
        var sPath = evt.path.replace(/\\/g, "/");
        var dLPath = sPath.replace(fSource, "");
        var dLFolder = /^\//.test(dLPath) ? path.resolve(toFolder, "." + dLPath) : path.resolve(toFolder, "./" + dLPath);
        var dLFolerName = dLFolder + "/" + evt.name;
        var ignore = ignoreCheck(evt.path + "/" + evt.name);
        if (!ignore) {
            if (!exists(dLFolerName)) {
                mkdir(dLFolerName);
            }
        }
    });
};
var saveConfigToFile = function (saveFileName, configData) {
    var sData = [];
    if (configData && !isEmpty(configData)) {
        for (var key in configData) {
            sData.push(configData[key]);
        }
    }
    fs.writeFileSync(saveFileName, sData.join('\r\n'));
};
var createGitIgnore = function (targetFileName, options) {
    saveConfigToFile(targetFileName, options);
};
var createNpmIgnore = function (targetFileName, options) {
    saveConfigToFile(targetFileName, options);
};
/**
 * 写入文件
 * @param {*} fileName [string]写入文件名
 * @param {*} data [any] 写入文件数据
 * @param {*} options [WriteFileOptions]
 */
var writeFile = fs.writeFileSync;
exports.default = {
    copyFiles: copyFiles,
    createGitIgnore: createGitIgnore,
    createNpmIgnore: createNpmIgnore,
    getNewProjectFolder: getNewProjectFolder,
    inputProjectInfo: inputProjectInfo,
    isEmpty: isEmpty,
    exists: exists,
    emptyFolder: emptyFolder,
    mkdir: mkdir,
    getSourcePath: getSourcePath,
    readFile: readFile,
    isFile: isFile,
    writeFile: writeFile,
    scanFolder: scanFolder
};
//# sourceMappingURL=static.js.map