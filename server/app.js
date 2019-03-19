const express = require("express");
const fs = require("fs");
const app = express();

app.use((req, res, next) => {
  // write your logging code here
  const agent = req.headers["user-agent"].replace(",", "");
  const time = new Date().toISOString();
  const method = req.method;
  const resource = req.originalUrl;
  const version = "HTTP/" + req.httpVersion;
  const status = res.statusCode;
  const log = `${agent},${time},${method},${resource},${version},${status}`;
  console.log(log);
  fs.appendFile("log.csv", log + "\n", err => {
    if (err) throw err;
  });
  next();
});

app.get("/", (req, res) => {
  // write your code to respond "ok" here
  res.status(200).send("OK");
});

app.get("/logs", (req, res) => {
  // write your code to return a json object containing the log data here
  fs.readFile("log.csv", "utf8", function(err, contents) {
    if (err) throw err;
    let processedData = processData(contents);
    res.json(processedData);
  });
});

function processData(csv) {
  var allTextLines = csv.split("\n");
  let content = [];
  for (let i = 1; i < allTextLines.length - 1; i++) {
    content.push(allTextLines[i].split(","));
  }
  let finalArr = [];
  for (let i = 0; i < content.length; i++) {
    let obj = {};
    obj["Agent"] = content[i][0];
    obj["Time"] = content[i][1];
    obj["Method"] = content[i][2];
    obj["Resource"] = content[i][3];
    obj["Version"] = content[i][4];
    obj["Status"] = content[i][5];
    finalArr.push(obj);
  }
  return finalArr;
}

module.exports = app;
