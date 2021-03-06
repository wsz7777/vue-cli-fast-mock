const path = require("path");
const fs = require("fs");
const process = require("process");
const hjson = require("hjson");
const Mock = require("mockjs");


let CONFIG = {
  baseUrl: "/"
};
const getRootPath = (() => {

  const mockP = path.join(process.cwd(), "mock");
  const state = fs.existsSync(mockP) && fs.statSync(mockP).isDirectory();

  let f = path.join(state ? process.cwd() : __dirname, "mock");

  let confCont = fs.existsSync(path.join(f, "config.json")) ?
    JSON.parse(fs.readFileSync(path.join(f, "config.json"), "utf8")) : CONFIG;

  CONFIG = Object.assign({},CONFIG, confCont);

  return f;
})();

const defultCf = {
  method: "post",
  done: false,
  temp: true
};

const rquestList = (function (url) {
  const arr = [];
  const porUrl = [];
  const readlist = url => {
    const list = fs.readdirSync(path.join(url));
    list.forEach(elm => {
      const nextUrl = path.join(url, elm);
      const state = fs.existsSync(nextUrl);
      const goNext = state ? fs.statSync(nextUrl).isDirectory() : false;

      if (goNext) {
        porUrl.push(elm);
        readlist(nextUrl);
      } else {
        const [name] = elm.split(".");
        const { method, done, temp } = getConfig(nextUrl);
        porUrl.push(name);
        !done &&
          arr.push({
            name,
            method,
            temp,
            path: `/${porUrl.join("/")}`,
            nextUrl
          });
      }
      porUrl.pop();
    });
  };
  console.time("getlist");
  readlist(url);
  console.timeEnd("getlist");
  console.table(arr);
  return arr;
})(getRootPath);

function getConfig (fileUrl) {
  const content = fs.readFileSync(fileUrl, "utf8");
  const list = content.split("\n");
  const config = list.filter(line => /^\s*\/\/\s*(.+)/.exec(line));
  const option = {};
  config.forEach(v => {
    const [key, value] = v.replace(/(\/\/)|\s/g, "").split(":");
    let val = null;
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

function getContext (fileUrl) {
  const content = fs.readFileSync(fileUrl, "utf8");
  const utf8ToJson = hjson.parse(content);
  return Mock.mock(utf8ToJson);
};

module.exports = app => {
  console.time("setting api");

  rquestList.forEach(v => {
    app[v.method](`${CONFIG.baseUrl}${v.path}`, (req, res) => {
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json; charset=utf-8"
      });

      const data = getContext(v.nextUrl);

      res.send(v.temp ? { code: "0000", msg: "成功", data } : data);
    });
  });
  console.timeEnd("setting api");
};
