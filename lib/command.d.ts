import { Common } from "elmer-common";
export declare type TypeCommandInitCallbackResult = {
    commands?: string[];
    options?: any;
};
export declare type ICommandInitCallback = (options: any) => TypeCommandInitCallbackResult;
export default class CommandHelper extends Common {
    private _version;
    private _auther;
    private _email;
    private _command;
    private _options;
    private _maxOptionLength;
    private _maxCommandLength;
    private _processArgv;
    private _helpKey;
    private _initCallback;
    constructor(processArgv: string[]);
    /**
     * 配置命令版本
     * @param ver 版本信息
     */
    version(ver: string): CommandHelper;
    author(auth: string): CommandHelper;
    email(email: string): CommandHelper;
    command(cmd: string, desc?: string): CommandHelper;
    option(option: string, desc: string): CommandHelper;
    action(keyword: string, callback: Function): CommandHelper;
    /**
     * 配置初始化命令执行方法，根据返回值类型配置不同参数
     * @param callback
     */
    init(callback: ICommandInitCallback): CommandHelper;
    run(): void;
    private _help;
    private getOptions;
}
