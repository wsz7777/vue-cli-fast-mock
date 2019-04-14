import * as fs from "fs";
import * as hjson from "hjson";
import * as Mock from "mockjs";

interface Option {
  [propName: string]: string | boolean;
}

const defultCf = {
  method: "post",
  done: false,
  temp: true
};

/**
 * @description 读取内容类
 */
class ReadFile {
  /**
   * @description 读取文件内容
   */
  getContext(fileUrl: string) {
    const content = fs.readFileSync(fileUrl, "utf8");
    const utf8ToJson = hjson.parse(content);
    return Mock.mock(utf8ToJson);
  }

  /**
   * @description 读取配置
   * @param {*} fileUrl
   */
  getConfig(fileUrl: string) {
    const content = fs.readFileSync(fileUrl, "utf8");
    const list = content.split("\n");
    const config: Array<any> = list.filter(line =>
      /^\s*\/\/\s*(.+)/.exec(line)
    );
    const option: Option = {};
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
  }
}

const getFromFile = new ReadFile();
export default getFromFile;
