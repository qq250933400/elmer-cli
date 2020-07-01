import staticObj from "./static";
var path = require("path");
var color = require("cli-color");

export default (desPath, options, fn) => {
    const sourcePath = staticObj.getSourcePath(options);
    const fileName = (/\/$/.test(sourcePath) ? sourcePath : sourcePath + "/") + "package.json";
    const txt = staticObj.readFile(fileName);
    if(staticObj.isEmpty(txt)) {
        console.log(color.red("[ERR] 创建失败，package.json配置文件丢失。"));
    } else {
        const data = JSON.parse(txt);
        data["name"] = options.name;
        staticObj.inputProjectInfo((param) => {
            for(var key in param) {
                data[key] = param[key];
            }
            staticObj.writeFile(path.resolve(desPath, "./package.json"), JSON.stringify(data, null, 4));
            typeof fn === "function" && fn();
        });
    }
}