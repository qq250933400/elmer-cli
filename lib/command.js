"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var elmer_common_1 = require("elmer-common");
var CommandHelper = /** @class */ (function (_super) {
    __extends(CommandHelper, _super);
    function CommandHelper(processArgv) {
        var _this = _super.call(this) || this;
        _this._version = "1.0.0";
        _this._auther = "elmer s j mo";
        _this._email = "250933400@qq.com";
        _this._command = {};
        _this._options = {};
        _this._maxOptionLength = 0;
        _this._maxCommandLength = 0;
        _this._processArgv = [];
        _this._helpKey = "-h, --help";
        _this._options[_this._helpKey] = {
            desc: "Print help message",
            length: elmer_common_1.StaticCommon.strLen(_this._helpKey)
        };
        _this._maxOptionLength = elmer_common_1.StaticCommon.strLen(_this._helpKey);
        _this._processArgv = processArgv;
        return _this;
    }
    /**
     * 配置命令版本
     * @param ver 版本信息
     */
    CommandHelper.prototype.version = function (ver) {
        this._version = ver;
        return this;
    };
    CommandHelper.prototype.author = function (auth) {
        this._auther = auth;
        return this;
    };
    CommandHelper.prototype.email = function (email) {
        this._email = email;
        return this;
    };
    CommandHelper.prototype.command = function (cmd, desc) {
        if (!/^[\-]{1,}/.test(cmd)) {
            var len = elmer_common_1.StaticCommon.strLen(cmd);
            this._command[cmd] = {
                desc: desc,
                length: len
            };
            if (len > this._maxCommandLength) {
                this._maxCommandLength = len;
            }
        }
        else {
            throw new Error("The command of \"" + cmd + "\" can not be start with character - or --");
        }
        return this;
    };
    CommandHelper.prototype.option = function (option, desc) {
        var len = elmer_common_1.StaticCommon.strLen(option);
        this._options[option] = {
            desc: desc,
            length: len
        };
        if (len > this._maxOptionLength) {
            this._maxOptionLength = len;
        }
        return this;
    };
    CommandHelper.prototype.action = function (keyword, callback) {
        if (/^[\-]{1,}/.test(keyword)) {
            if (this._options[keyword]) {
                this._options[keyword].action = callback;
            }
            else {
                throw new Error("The action target key \"" + keyword + "\" is not exists in option list");
            }
        }
        else {
            if (this._command[keyword]) {
                this._command[keyword].action = callback;
            }
            else {
                throw new Error("The action target key \"" + keyword + "\" is not exisits in command list.");
            }
        }
        return this;
    };
    /**
     * 配置初始化命令执行方法，根据返回值类型配置不同参数
     * @param callback
     */
    CommandHelper.prototype.init = function (callback) {
        this._initCallback = callback;
        return this;
    };
    CommandHelper.prototype.run = function () {
        var _this = this;
        this._help();
        this.getOptions().then(function (optionsValue) {
            var cmdKeys = Object.keys(_this._command);
            var params = [];
            var initResult;
            if (typeof _this._initCallback === "function") {
                initResult = _this._initCallback(optionsValue);
                if (initResult && _this.isArray(initResult.commands)) {
                    initResult.commands.map(function (initCmd) {
                        if (_this._command[initCmd] && typeof _this._command[initCmd].action === "function") {
                            params.push({
                                id: initCmd,
                                params: optionsValue,
                                fn: _this._command[initCmd].action
                            });
                        }
                    });
                }
                if (initResult && initResult.options) {
                    _this.extend(optionsValue, initResult.options);
                }
            }
            if (cmdKeys && cmdKeys.length > 0) {
                cmdKeys.map(function (cmdKey) {
                    if (elmer_common_1.getCommand(_this._processArgv, cmdKey)) {
                        // has this command in args
                        if (typeof _this._command[cmdKey].action === "function") {
                            params.push({
                                id: cmdKey,
                                params: optionsValue,
                                fn: _this._command[cmdKey].action
                            });
                        }
                    }
                });
            }
            if (params.length > 0) {
                elmer_common_1.queueCallFunc(params, null, {
                    throwException: true
                }).then(function () {
                    console.log("Complete");
                }).catch(function (error) {
                    console.error(error);
                });
            }
            else {
                console.log("Complete");
            }
        }).catch(function (error) {
            console.error(error);
            console.error("Exit code without 0");
        });
    };
    CommandHelper.prototype._help = function () {
        var _this = this;
        var showHelp = elmer_common_1.getCommand(this._processArgv, "-h") === null || elmer_common_1.getCommand(this._processArgv, "--help") === null;
        if (showHelp) {
            console.log("");
            console.log("Author: ", this._auther);
            console.log("Email:  ", this._email);
            console.log("");
            // show options information
            if (this._options) {
                console.log("Options: ");
                Object.keys(this._options).map(function (key) {
                    var option = _this._options[key];
                    var len = option.length;
                    var leftLen = _this._maxOptionLength - len;
                    var spaceLen = leftLen + 10;
                    console.log("    " + key + " ".repeat(spaceLen), option.desc);
                });
            }
            console.log("");
            // show options information
            if (this._options) {
                console.log("Command: ");
                Object.keys(this._command).map(function (key) {
                    var tmpCmd = _this._command[key];
                    var len = tmpCmd.length;
                    var leftLen = _this._maxOptionLength - len;
                    var spaceLen = leftLen + 10;
                    console.log("    " + key + " ".repeat(spaceLen), tmpCmd.desc);
                });
            }
            console.log("");
        }
    };
    CommandHelper.prototype.getOptions = function () {
        var _this = this;
        var optionKeys = Object.keys(this._options);
        if (optionKeys && optionKeys.length > 0) {
            var params_1 = [];
            optionKeys.map(function (opKey) {
                if (opKey !== _this._helpKey) {
                    var opArr = opKey.split(",");
                    var op = _this._options[opKey];
                    var opValue_1;
                    for (var i = 0; i < opArr.length; i++) {
                        var _opV = elmer_common_1.getCommand(_this._processArgv, opArr[i].replace(/^\s*/, "").replace(/\s*$/, ""));
                        if (!_this.isEmpty(_opV) || _opV === null) {
                            opValue_1 = _opV;
                            break;
                        }
                    }
                    if (!_this.isEmpty(opValue_1) || opValue_1 === null) {
                        // 配置有此参数
                        if (typeof op.action === "function") {
                            params_1.push({
                                id: opKey,
                                params: null,
                                fn: op.action
                            });
                        }
                        else {
                            params_1.push({
                                id: opKey,
                                params: null,
                                fn: function () { return opValue_1; }
                            });
                        }
                    }
                }
            });
            return elmer_common_1.queueCallFunc(params_1);
        }
        else {
            return Promise.resolve();
        }
    };
    return CommandHelper;
}(elmer_common_1.Common));
exports.default = CommandHelper;
//# sourceMappingURL=command.js.map