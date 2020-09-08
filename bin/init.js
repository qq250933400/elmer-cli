#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const color = require("cli-color");
const apiBuilder = require("../lib/builder").default;
const supportProjects = [
    {
        code: "A",
        message: "创建UI开发项目",
        sourcePath: "./ui",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/package\.json$/],
        dependencies: ["elmer-ui-core", "elmer-common", "elmer-virtual-dom", "elmer-common-ui", "elmer-redux"],
        npmignore: [
            "/node_modules/",
            "/dist/",
            "/bin/",
            "/src/",
            "/config/",
            "/lib/assets/",
            "./yarn.lock",
            ".DS_Store",
            "/**/*/.DS_Store"
        ],
        gitignore: [
            "/node_modules/",
            "/dist/",
            "/lib/",
            "yarn.lock",
            "yarn-error.log",
            "package-lock.json",
            "",
            ".DS_Store",
            "/**/*/.DS_Store",
        ]
    }, {
        code: "B",
        message: "创建API开发项目",
        sourcePath: "./api",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/api\/package\.json$/],
        npmignore: [
            "/src/",
            "/node_modules/",
            "/.vscode/",
            "/mochawesome-report/",
            "/test/",
            "yarn-error.log",
            "yarn.lock",
            "package-lock.json",
            ".DS_Store",
            "/**/*/.DS_Store"
        ],
        gitignore: [
            "/node_modules/",
            "/demo/",
            "/.vscode/",
            "yarn.lock",
            "/example/",
            "/lib/",
            "/mochawesome-report/",
            "package-lock.json",
            ".DS_Store",
            "/**/*/.DS_Store"

        ]
    },{
        code: "C",
        message: "创建服务端渲染项目",
        sourcePath: "./rsv",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/package\.json$/]
    }, {
        code: "Q",
        message: "退出程序"
    }
];
const inputCode = (codeList, fn, tipMsg) => {
    inquirer.prompt([
        {
            type: "list",
            name: "initCode",
            message: tipMsg || "请选择创建项目模版: ",
            choices: codeList
        }
    ]).then((resp) => {
        const code = (resp.initCode || "").toUpperCase();
        typeof fn === "function" && fn(code);
    });
};
const inputProjectName = (fn, msg) => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: msg || "请输入项目名称（规则：/[A-Z]{1,}[A-Z0-9\-]*/i） >>> "
        }
    ]).then((resp) => {
        const name = resp.name || "";
        if(/^[A-Z]{1,}[A-Z0-9\-]*$/i.test(name)) {
            typeof fn ==="function" && fn(name);
        } else {
            inputProjectName(fn, color.red("输入名称格式错误，请重新输入（规则：/[A-Z]{1,}[A-Z0-9\-]*/i） >>> "));
        }
    });
};

module.exports = ()=>{
    const codeList = [];
    supportProjects.map((item) => {
        codeList.push({
            value: item.code.toUpperCase(),
            name: "  [" + item.code.toUpperCase() + "] " + item.message
        });
    });
    inputCode(codeList, (code) => {
        let project;
        if(code !== "Q") {
            for(let i=0;i<supportProjects.length;i++) {
                if(code === supportProjects[i].code.toUpperCase()) {
                    project = supportProjects[i];
                    break;
                }
            }
            inputProjectName((name) => {
                const exec = project.exec;
                delete project.exec;
                project.name = name;
                project.yarn = program.yarn;
                if(typeof exec === "function") {
                    exec(project);
                } else {
                    console.log(color.red("[ERR] 创建项目失败，未配置exec执行函数"));
                }
            });
        } else {
            console.log(color.red("[Exit] 取消操作!"));
        }
    });
}