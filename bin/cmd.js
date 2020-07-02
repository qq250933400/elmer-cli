#!/usr/bin/env node
var webpackServer = require("../lib/webpack/server").default;
var webpackBuild = require("../lib/webpack/build").default;
var init = require("./init");
var Command = require("../lib/command").default;
var command = new Command(process.argv);

command.version("1.0.0")
    .author("Elmer S J MO")
    .option("-y", "for test")
    .option("-d, --delete", "Delete Object")
    .option("-t, --template", "Webpack 模板文件，未设置将使用默认文件")
    .option("-e, --entry", "webpack entry js")
    .option("-b", "--base", "webpack-dev-server content base")
    .option("port", "webpack-dev-server port")
    .option("mode", "mode=dev, for start development; mode=build, for build application")
    .command("init", "Create Project")
    .command("start", "for start development")
    .command("build", "for build application")
    .action("start", () => {
        console.log("Start development");
        webpackServer();
    })
    .action("build", () => {
        console.log("do build application");
       webpackBuild();
    })
    .action("init", () => {
        init();
    })
    .run();
