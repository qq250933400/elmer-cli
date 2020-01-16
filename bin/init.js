const program = require("commander");
const inquirer = require("inquirer");
const color = require("cli-color");
const apiBuilder = require("../lib/ApiBuilder");
const supportProjects = [
    {
        code: "A",
        message: "创建UI开发项目",
        sourcePath: "./ui",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/api\/package\.json$/]
    }, {
        code: "B",
        message: "创建API开发项目",
        sourcePath: "./api",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/api\/package\.json$/]
    },{
        code: "C",
        message: "创建服务端渲染项目",
        sourcePath: "./rsv",
        exec: apiBuilder,
        ignore: [/\/\.DS_Store$/, /\/api\/package\.json$/]
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

program.version("1.0.0")
    .option("-y, --yarn", "指定yarn为包管理器")
    .command("init")
    .description("创建项目")
    .action(() => {
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
    });

module.exports = program;