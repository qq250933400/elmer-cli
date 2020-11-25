import { deployConfig, getSourceConfig, getServerConfig, TypeSourceConfig, TypeServerConfig, getName } from "./config";
import { getCommand, queueCallFunc } from "elmer-common";
import Utils from "../utils/Base";
import files from "../utils/files";
// import shelljs from "shelljs";
const inquirer = require("inquirer");
var shelljs = require("shelljs");
const env = getCommand(process.argv, "env") as string;

@deployConfig()
export default class Deployment extends Utils {

    @getSourceConfig(env)
    sourceConfig: TypeSourceConfig;

    @getServerConfig(env)
    serverConfig: TypeServerConfig;

    @getName()
    projectName: string;
    constructor() {
        super();
        if(this.isEmpty(this.projectName)) {
            this.log("The field of name is missing in the configuration file", "ERROR");
            throw new Error("Parameter is missing");
        }
    }
    init(): void {
        const initData = {
            "name": "example",
            "dev": {
                "server": {
                    "host": "127.0.0.1",
                    "pwd": "your password",
                    "workspace": "/mnt/demo",
                    "temp": "/mnt/temp",
                    "project": "example"
                },
                "source": {
                    "dist": "/Users/mnt/example/dist",
                    "temp": "/Users/mnt/example/temp"
                }
            }
        };
        const configFile = process.cwd() + "/deployment.json";
        if(files.exists(configFile)) {
            this.log("Configuration file already exists", "ERROR");
        } else {
            files.writeFileSync(configFile, JSON.stringify(initData, null, 4));
        }
    }
    sourceCompress(): Deployment {
        this.log("Compress resource files", "INFO");
        if(!files.exists(this.sourceConfig.dist)) {
            this.log("Source files not exists.", "ERROR");
        }
        if(!files.exists(this.sourceConfig.temp)) {
            files.mkdir(this.sourceConfig.temp);
        }
        const sourceMatch = this.sourceConfig.dist.match(/\/([a-z0-9\.\_\-]{1,})$/);
        const sourcePath = this.sourceConfig.dist.replace(/\/[a-z0-9\.\_\-]{1,}$/, "\/");
        const sourceFolderPath = sourceMatch[1];
        queueCallFunc([
            {
                id: "compress",
                params: sourceFolderPath,
                fn: ():any => {
                    return new Promise<any>((resolve, reject) => {
                        this.log("Compress local fiels", "WARN");
                        this.exec(`cd ${sourcePath};tar -czvf ./${this.projectName}.tar.gz ./${sourceFolderPath};`)
                            .then(() => {
                                resolve({
                                    zip: sourcePath + "/" + this.projectName + ".tar.gz"
                                });
                            }).catch((err) => {
                                reject(err);
                            });
                    });
                }
            }, {
                id: "mvtotemp",
                params: "",
                fn: (option):any => {
                    return new Promise<any>((resolve, reject) => {
                        if(files.exists(option.lastResult.zip)) {
                            const now = new Date();
                            const targetName = `${this.sourceConfig.temp}/${this.projectName}.tar.gz`;
                            const cmdmvtotemp = `mv ${option.lastResult.zip} ${this.sourceConfig.temp}/${this.projectName}.tar.gz`; // 将压缩文件移动到临时文件件
                            const unlinkConflicName = `unlink ${targetName}`; // 删除已经存在的临时文件
                            const cmdCode = files.exists(targetName) ? [unlinkConflicName, cmdmvtotemp].join(";") : cmdmvtotemp;
                            this.exec(cmdCode)
                                .then(() => {
                                    resolve({
                                        zip: targetName
                                    });
                                }).catch((err) => {
                                    reject(err);
                                });
                        }
                    });
                }
            }, {
                id: "deletTemp",
                params: "",
                fn: (): any => {
                    const targetTempName = this.serverConfig.temp + "/" + this.projectName + ".tar.gz";
                    const unlinkTemp = files.exists(targetTempName) ? `ssh ${this.serverConfig.user}@${this.serverConfig.host} unlink ${targetTempName};` : "";
                    if(!this.isEmpty(unlinkTemp)) {
                        return this.exec(unlinkTemp)
                    }
                }
            },{
                id: "copytoserver",
                params: "",
                fn: (): any => {
                    const targetName = `${this.sourceConfig.temp}/${this.projectName}.tar.gz`;
                    const tempName = `${this.projectName}.tar.gz`;
                    return this.exec(`cd ${this.sourceConfig.temp};scp ${tempName} ${this.serverConfig.user}@${this.serverConfig.host}:/${targetName}`);
                }
            }
        ], null, {
            throwException: true
        }).then(() => {
            this.log("Deployment done", "SUCCESS");
        }).catch((err) => {
            this.log(err.message, "ERROR");
            console.error(err);
        })
        return this;
    }
    private exec(cmd:String): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const child = shelljs.exec(cmd, {
                async: true,
                silent: false
            });
            child.on("close", (a) => {
                resolve(a);
            });
            child.on("error", (err) => {
                reject(err);
            });
        })
    }
}