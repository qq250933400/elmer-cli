"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var static_1 = require("./static");
var path = require("path");
var color = require("cli-color");
exports.default = (function (desPath, options, fn) {
    var sourcePath = static_1.default.getSourcePath(options);
    var fileName = (/\/$/.test(sourcePath) ? sourcePath : sourcePath + "/") + "package.json";
    var txt = static_1.default.readFile(fileName);
    if (static_1.default.isEmpty(txt)) {
        console.log(color.red("[ERR] 创建失败，package.json配置文件丢失。"));
    }
    else {
        var data_1 = JSON.parse(txt);
        data_1["name"] = options.name;
        static_1.default.inputProjectInfo(function (param) {
            for (var key in param) {
                data_1[key] = param[key];
            }
            static_1.default.writeFile(path.resolve(desPath, "./package.json"), JSON.stringify(data_1, null, 4));
            typeof fn === "function" && fn();
        });
    }
});
//# sourceMappingURL=createPackage.js.map