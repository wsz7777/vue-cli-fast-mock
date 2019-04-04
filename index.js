const path = require("path");
module.exports = app => {
  // rquestList.forEach(v => {
  //   app[v.method](`/mos/api${v.path}`, (req, res) => {
  //     res.set({
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
  //       "Access-Control-Allow-Headers": "Content-Type",
  //       "Content-Type": "application/json; charset=utf-8"
  //     });

  //     const data = getContext(v.nextUrl);

  //     res.send(v.temp ? { code: "0000", msg: "成功", data } : data);
  //   });
  // });
  app.get('/mos/api/hahaha', (req, res) => {
    res.send({ code: "0000", msg: "成功", data: path.join(__dirname) });
  })
};
