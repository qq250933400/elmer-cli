const static = require("./Static");
const path = require("path");
const color = require("cli-color");

module.exports = (desPath, options, fn) => {
    const sourcePath = static.getSourcePath(options);
    const fileName = (/\/$/.test(sourcePath) ? sourcePath : sourcePath + "/") + "package.json";
    const txt = static.readFile(fileName);
    if(static.isEmpty(txt)) {
        console.log(color.red("[ERR] 创建失败，package.json配置文件丢失。"));
    } else {
        const data = JSON.parse(txt);
        data["name"] = options.name;
        static.inputProjectInfo((param) => {
            for(var key in param) {
                data[key] = param[key];
            }
            static.writeFile(path.resolve(desPath, "./package.json"), JSON.stringify(data, null, 4));
            typeof fn === "function" && fn();
        });
    }
}