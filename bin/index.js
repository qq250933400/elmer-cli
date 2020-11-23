#!/usr/bin/env node
require("colors");

var webpackServer = require("../lib/webpack/server").default;
var webpackBuild = require("../lib/webpack/build").default;
var init = require("./init");
var Command = require("../lib/command").default;
var command = new Command(process.argv);
var path = require("path");

var updateVersion = require("./version");


command.version("1.0.0")
    .author("Elmer S J MO")
    .email("250933400@qq.com")
    .option("-y", "for test")
    .option("-d, --delete", "Delete Object")
    .option("-t, --template", "Webpack 模板文件，未设置将使用默认文件")
    .option("-e, --entry", "webpack entry js")
    .option("-b", "--base", "webpack-dev-server content base")
    .option("port", "webpack-dev-server port")
    .option("mode", "mode=dev, for start development; mode=build, for build application")
    .option("um", "升级版本模式, m->(main version), r -> (release version), c -> (Compiled version)")
    .option("env", "env=dev or env=prod, 定义运行环境环境，切换不同的api domain")
    .command("version", "show the cli version", () => {
        console.log(`version: ${command.getVersion()}`.green);
    })
    .command("init", "Create Project")
    .command("start", "for start development")
    .command("build", "for build application")
    .command("uv", "update version", (options, params) => {
        updateVersion(params);
    })
    .command("path", "显示cli所在位置，当前项目位置", () => {
        console.log("elmer-cli: ", path.resolve(__dirname, "../"));
        console.log("project: ", process.cwd());
    })
    .action("start", () => {
        console.log("Start development");
        webpackServer();
    })
    .action("build", () => {
        console.log("Build application");
       webpackBuild();
    })
    .action("init", () => {
        init();
    })
    .description("elmer-cli-webpack-config", "在package.json指定自定义webpack配置")
    .description("----build", "指定打包的webpack配置脚本")
    .description("----development", "指定开发模式webpack配置脚本")
    .description("----hash", "boolean类型数据，是否开启输出文件名+hash值")
    .run();
