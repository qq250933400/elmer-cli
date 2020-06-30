#!/usr/bin/env node

var Command = require("../lib/command").default;
var command = new Command(process.argv);

command.version("1.0.0")
    .author("Elmer S J MO")
    .option("-y", "for test")
    .option("-d, --delete", "Delete Object")
    .option("mode", "mode=dev, for start development; mode=build, for build application")
    .command("start", "for start development")
    .command("build", "for build application")
    .command("compress", "for test purpuse")
    .action("start", () => {
        console.log("do start development");
    })
    .action("build", () => {
        console.log("do build application");
    })
    .action("compress", (op, p) => {
        console.log("the last step", p);
    })
    .init((param) => {
        const cmdList = [];
        if(param.mode === "dev") {
            cmdList.push("start");
        } else {
            cmdList.push("build");
        }
        cmdList.push("compress");
        return {
            commands: cmdList,
            options: {
                title: "fuck"
            }
        };
    })
    .run();
