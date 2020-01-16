const static = require("./Static");
const color = require("cli-color");
const createPackage = require("./CreatePackage");

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
    // createPackage(rootPath, options);
    static.copyFiles(sourcePath, rootPath);
}
