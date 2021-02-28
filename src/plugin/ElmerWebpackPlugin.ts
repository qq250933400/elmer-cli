require("colors");
const path = require("path");
const fs = require("fs");
// import fs from "fs";
// import path from "path";
type ElmerWebpackPluginOptions = {
    remove?: string[];
};
export class ElmerWebpackPlugin {
    private options: ElmerWebpackPluginOptions;
    constructor(options: ElmerWebpackPluginOptions) {
        this.options = options;
    }
    apply(compiler:any): void {
        compiler.hooks.done.tap("ElmerWebpackPlugin", ({ compilation }) => {
            if(this.options) {
                if(this.options.remove && this.options.remove.length > 0) {
                    const outPutOptions = compilation.outputOptions;
                    const rootPath = outPutOptions.path;
                    this.options.remove.map((removeItem: string)=>{
                        try{
                            const removePath:string = path.resolve(rootPath, removeItem);
                            if(fs.existsSync(removePath)) {
                                const fStat = fs.fstatSync(removePath as any);
                                if(fStat.isDirectory()) {
                                    fs.rmdirSync(removePath);
                                } else {
                                    fs.unlinkSync(removePath);
                                }
                                console.log(`[Info]    The path "${removePath}" has been deleted`.green);
                            } else {
                                console.log(`[Info]    The path to delete does not exists. -> ${removePath}`.yellow);
                            }
                        }catch(e) {
                            console.log(`[ERR]    ${e.message}`.red);
                        }
                    });
                }
            }
        });
    }
}

export default ElmerWebpackPlugin;
