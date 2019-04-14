"use strict";
exports.__esModule = true;
var fs = require("fs");
var hjson = require("hjson");
var Mock = require("mockjs");
var defultCf = {
    method: "post",
    done: false,
    temp: true
};
/**
 * @description 读取内容类
 */
var ReadFile = /** @class */ (function () {
    function ReadFile() {
    }
    /**
     * @description 读取文件内容
     */
    ReadFile.prototype.getContext = function (fileUrl) {
        var content = fs.readFileSync(fileUrl, "utf8");
        var utf8ToJson = hjson.parse(content);
        return Mock.mock(utf8ToJson);
    };
    /**
     * @description 读取配置
     * @param {*} fileUrl
     */
    ReadFile.prototype.getConfig = function (fileUrl) {
        var content = fs.readFileSync(fileUrl, "utf8");
        var list = content.split("\n");
        var config = list.filter(function (line) {
            return /^\s*\/\/\s*(.+)/.exec(line);
        });
        var option = {};
        config.forEach(function (v) {
            var _a = v.replace(/(\/\/)|\s/g, "").split(":"), key = _a[0], value = _a[1];
            var val = null;
            switch (value) {
                case "false":
                    val = false;
                    break;
                case "true":
                    val = true;
                    break;
                default:
                    val = value;
                    break;
            }
            option[key] = val;
        });
        // console.log("defultCf", defultCf);
        // console.log("option", option);
        // console.log(Object.assign({}, defultCf, option));
        return Object.assign({}, defultCf, option);
    };
    return ReadFile;
}());
var getFromFile = new ReadFile();
exports["default"] = getFromFile;
