const StaticBuilder = require("elmer-ui-core/lib/builder").StaticBuilder;
const fs = require("fs");
const path = require("path");
var srcPath = path.resolve("./src");
var desPath = path.resolve("./lib");
var obj = new StaticBuilder(fs, srcPath, desPath);
obj.run();