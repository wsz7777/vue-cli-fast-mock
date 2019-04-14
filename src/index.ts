import * as path from "path";
import * as fs from "fs";
import * as Express from "express";
import getFromFile from "./getContect";

let CONFIG = {
  baseUrl: "/"
};

const getRootPath = (() => {
  const here = path.join(__dirname, "..");
  console.log(path.join(here, "package.json"));
  const pkjson = fs.readFileSync(path.join(here, "package.json"), "utf8");
  const cont = JSON.parse(pkjson);
  let f = null;
  if (cont._where) {
    f = cont._where;
  } else {
    f = path.join(__dirname, "..","mock");
  }

  let confCont = fs.existsSync(path.join(f, "config.json"))
    ? JSON.parse(fs.readFileSync(path.join(f, "config.json"), "utf8"))
    : {};

  CONFIG = Object.assign(CONFIG, confCont);
  console.log(f);
  return f;
})();

interface listOne {
  name: string;
  method: string;
  temp: boolean;
  path: string;
  nextUrl: string;
}

const rquestList = (function(urlF: string) {
  const arr: Array<any> = [];
  const porUrl: Array<any> = [];
  const readlist = (url: string) => {
    const list = fs.readdirSync(path.join(url));
    list.forEach((elm: string) => {
      const nextUrl = path.join(url, elm);
      const state = fs.existsSync(nextUrl);
      const goNext = state ? fs.statSync(nextUrl).isDirectory() : false;

      if (goNext) {
        porUrl.push(elm);
        readlist(nextUrl);
      } else {
        const [name] = elm.split(".");
        const { method, done, temp } = getFromFile.getConfig(nextUrl);
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
  readlist(urlF);
  console.timeEnd("getlist");
  console.table(arr);
  return arr;
})(getRootPath);

const before = (app: Express.Application) => {
  console.time("setting api");

  rquestList.forEach((v: listOne) => {
    const data = getFromFile.getContext(v.nextUrl);

    if (v.method === "get") {
      app.get(
        `${CONFIG.baseUrl}${v.path}`,
        (req: Express.Request, res: Express.Response) => {
          res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json; charset=utf-8"
          });
          res.send(v.temp ? { code: "0000", msg: "成功", data } : data);
        }
      );
    } else if (v.method === "post") {
      app.post(
        `${CONFIG.baseUrl}${v.path}`,
        (req: Express.Request, res: Express.Response) => {
          res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json; charset=utf-8"
          });
          res.send(v.temp ? { code: "0000", msg: "成功", data } : data);
        }
      );
    }
  });
  console.timeEnd("setting api");
};

export default before;
