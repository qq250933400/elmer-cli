require("colors");
const path = require("path");
const staticObj = require("../lib/static").default;


const updateVersion = (options) => {
    const um = options.um || "c";
    const rootPath = process.cwd();
    const package = path.resolve(rootPath, "./package.json");
    const packageData = staticObj.readFile(package);
    if(!staticObj.isEmpty(packageData)) {
        const jsonData = JSON.parse(packageData);
        const version = jsonData.version;
        const versionArr = version.split(".");
        if(um === "m") {
            const cValue = parseInt(versionArr[0],10);
            versionArr[0] = cValue + 1;
        } else if(um === "r") {
            const cValue = parseInt(versionArr[1],10);
            versionArr[1] = cValue + 1;
        } else {
            const cValue = parseInt(versionArr[2],10);
            versionArr[2] = cValue + 1;
        }
        jsonData.version = versionArr.join(".");
        staticObj.writeFile(package, JSON.stringify(jsonData, null, 4));
        console.log(`[INFO]  Update version to ${jsonData.version}`.blue);
    } else {
        console.log("[ERROR]  Not found package.json".red);
    }
}

module.exports = updateVersion;
