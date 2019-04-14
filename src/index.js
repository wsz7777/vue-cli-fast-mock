"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var getContect_1 = require("./getContect");
var CONFIG = {
    baseUrl: "/"
};
var getRootPath = (function () {
    var here = path.join(__dirname, "..");
    console.log(path.join(here, "package.json"));
    var pkjson = fs.readFileSync(path.join(here, "package.json"), "utf8");
    var cont = JSON.parse(pkjson);
    var f = null;
    if (cont._where) {
        f = cont._where;
    }
    else {
        f = path.join(__dirname, "..", "mock");
    }
    var confCont = fs.existsSync(path.join(f, "config.json"))
        ? JSON.parse(fs.readFileSync(path.join(f, "config.json"), "utf8"))
        : {};
    CONFIG = Object.assign(CONFIG, confCont);
    console.log(f);
    return f;
})();
var rquestList = (function (urlF) {
    var arr = [];
    var porUrl = [];
    var readlist = function (url) {
        var list = fs.readdirSync(path.join(url));
        list.forEach(function (elm) {
            var nextUrl = path.join(url, elm);
            var state = fs.existsSync(nextUrl);
            var goNext = state ? fs.statSync(nextUrl).isDirectory() : false;
            if (goNext) {
                porUrl.push(elm);
                readlist(nextUrl);
            }
            else {
                var name_1 = elm.split(".")[0];
                var _a = getContect_1["default"].getConfig(nextUrl), method = _a.method, done = _a.done, temp = _a.temp;
                porUrl.push(name_1);
                !done &&
                    arr.push({
                        name: name_1,
                        method: method,
                        temp: temp,
                        path: "/" + porUrl.join("/"),
                        nextUrl: nextUrl
                    });
            }
            porUrl.pop();
        });
    };
    console.time("getlist");
    readlist(urlF);
    console.timeEnd("getlist");
    console.table(arr);
    return arr;
})(getRootPath);
var before = function (app) {
    console.time("setting api");
    rquestList.forEach(function (v) {
        var data = getContect_1["default"].getContext(v.nextUrl);
        if (v.method === "get") {
            app.get("" + CONFIG.baseUrl + v.path, function (req, res) {
                res.set({
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.send(v.temp ? { code: "0000", msg: "成功", data: data } : data);
            });
        }
        else if (v.method === "post") {
            app.post("" + CONFIG.baseUrl + v.path, function (req, res) {
                res.set({
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT,POST,DELETE,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.send(v.temp ? { code: "0000", msg: "成功", data: data } : data);
            });
        }
    });
    console.timeEnd("setting api");
};
exports["default"] = before;
