#!/usr/bin/env node
require("colors");

var StaticBuilder = require("../lib/StaticBuilder").StaticBuilder;
var webpackServer = require("../lib/webpack/server").default;
var webpackBuild = require("../lib/webpack/build").default;
var getConfig = require("../lib/webpack/config").getOverrideConfig
var init = require("./init");
var Command = require("../lib/command").default;
var command = new Command(process.argv);
var fs = require("fs");
var path = require("path");

var updateVersion = require("./version");


command.version("1.0.0")
    .author("Elmer S J MO")
    .email("250933400@qq.com")
    .option("-v", "版本信息")
    .option("-d, --delete", "删除对象")
    .option("-t, --template", "Webpack 模板文件，未设置将使用默认文件")
    .option("-e, --entry", "webpack入口文件")
    .option("-b", "--base", "webpack-dev-server content base")
    .option("port", "webpack-dev-server port")
    .option("mode", "mode=dev, 开发模式; mode=build, 打包程序")
    .option("um", "升级版本模式, m->(main version), r -> (release version), c -> (Compiled version)")
    .option("env", "env=dev or env=prod, 定义运行环境环境，切换不同的api domain")
    .command("version", "显示cli版本", () => {
        console.log(`version: ${command.getVersion()}`.green);
    })
    .command("init", "创建项目")
    .command("start", "开发环境")
    .command("build", "打包项目")
    .command("uv", "升级版本", (options, params) => {
        updateVersion(params);
    })
    .command("path", "显示cli所在位置，当前项目位置", () => {
        console.log("elmer-cli: ", path.resolve(__dirname, "../"));
        console.log("project: ", process.cwd());
    })
    .command("static", "同步html,css等资源文件在编译时不能复制到编译目录", () => {
        const builder = new StaticBuilder(fs);
        const config = getConfig();
        const srcPath = builder.getValue(config, "static.src");
        const desPath = builder.getValue(config, "static.des");
        builder.setDesPath(path.resolve(process.cwd(),desPath));
        builder.setSrcPath(path.resolve(process.cwd(),srcPath));
        builder.run();
    })
    .action("start", () => {
        console.log("Start development");
        webpackServer();
    })
    .action("build", () => {
        console.log("Build application");
       webpackBuild();
    })
    .action("init", (opt) => {
        init();
        console.log(opt);
    })
    .description("elmer-cli", "在package.json指定自定义webpack配置")
    .description("----build", "指定打包的webpack配置脚本")
    .description("----development", "指定开发模式webpack配置脚本")
    .description("----hash", "boolean类型数据，是否开启输出文件名+hash值")
    .run();
