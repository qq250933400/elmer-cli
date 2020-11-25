import "colors";
import { StaticCommon as utils } from "elmer-common";

const DEPLOYMENAT_CONFIG_DATA_SAVEKEY = "DEPLOYMENAT_CONFIG_DATA_SAVEKEY";
const fs = require("fs");

export type TypeServerConfig = {
    host: string;
    user: string;
    pwd: string;
    workspace: string;
    temp: string;
    project:string;
}

export type TypeSourceConfig = {
    dist: string;
    temp: string;
}

export const getName = () => {
    return function(target:any, attrKey: string) {
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: function(): string {
                return utils.getValue(this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY],"name");
            }
        });
    }
}

export const getSourceConfig = (env?: string) => {
    return function(target:any, attrKey: string) {
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: function():TypeSourceConfig{
                if(utils.isEmpty(env)) {
                    return utils.getValue(this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY], "source");
                } else {
                    return utils.getValue(this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY][env], "source");
                }
            }
        });
    }
}

export const getServerConfig = (env?: string) => {
    return function(target:any, attrKey: string) {
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: function():TypeServerConfig{
                if(utils.isEmpty(env)) {
                    return utils.getValue(this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY], "server");
                } else {
                    return utils.getValue(this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY][env], "server");
                }
            }
        });
    }
}

export const getConfig = (env?: string) => {
    return function(target:any, attrKey: string) {
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: function(){
                if(utils.isEmpty(env)) {
                    return this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY];
                } else {
                    return this[DEPLOYMENAT_CONFIG_DATA_SAVEKEY][env];
                }
            }
        });
    }
}

export const deployConfig = () => {
    return function(target:Function) {
        const configFile = process.cwd() + "/deployment.json";
        if(!fs.existsSync(configFile)) {
            target.prototype.log("deployment config is mission in your project. [deployment.json]", "ERROR");
        } else {
            const fData = fs.readFileSync(configFile, "utf8");
            const configData = JSON.parse(fData);
            Object.defineProperty(target.prototype, DEPLOYMENAT_CONFIG_DATA_SAVEKEY, {
                value: configData,
                configurable: false,
                writable: false,
                enumerable: true
            });
        }
    }
}