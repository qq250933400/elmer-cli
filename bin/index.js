#!/usr/bin/env node

const program = require("./init");
// const translate = require("./translate");

program.command('help')
    .description('提示信息： 如何使用这个小工具.')
    .action(() => { program.outputHelp(); });

// translate(); // 初始化百度翻译的命令

program.parse(process.argv);