const program = require("commander");
const inquirer = require("inquirer");
const color = require("cli-color");
const apiBuilder = require("../lib/ApiBuilder");
const supportProjects = [
    {
        code: "A",
        message: "创建UI开发项目",
        sourcePath: "./ui",
    }, {
        code: "B",
        message: "创建API开发项目",
        sourcePath: "./api",
        exec: apiBuilder
    },{
        code: "C",
        message: "创建服务端渲染项目",
        sourcePath: "./rsv",
    }, {
        code: "Q",
        message: "退出程序"
    }
];
const inputCode = (codeList, fn, tipMsg) => {
    inquirer.prompt([
        {
            type: "input",
            name: "initCode",
            message: tipMsg || "请输入要创建的项目编号 >>> "
        }
    ]).then((resp) => {
        const code = (resp.initCode || "").toUpperCase();
        if(codeList.indexOf(code)<0) {
            inputCode(codeList, fn, color.red("[ERR] 输入编号不正确，请重新输入 >>> "));
        } else {
            if(code === "Q") {
                console.log(color.yellow("[INFO] 结束创建流程。"));
            } else {
                typeof fn === "function" && fn(code);
            }
        }
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
    .command("init")
    .description("创建项目")
    .action(() => {
        const codeList = [];
        console.log(color.blue.bold("[Init] 选择要创建的项目类型 (不区分大小写)"));
        supportProjects.map((item) => {
            codeList.push(item.code.toUpperCase());
            console.log(color.blue(`    [${item.code}] ${item.message}`));
        });
        inputCode(codeList, (code) => {
            let project;
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
                if(typeof exec === "function") {
                    exec(project);
                } else {
                    console.log(color.red("[ERR] 创建项目失败，未配置exec执行函数"));
                }
            });
        });
    });

module.exports = program;