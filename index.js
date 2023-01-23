const express = require("express");
const app = express();
const fs = require("fs");

let path = `/home/vsspl/fileWrite/logs.md`;

app.use(express.json());
app.get("/", (req, res) => {
  res.send({
    code: 200,
    info: "hello from express router",
  });
});

app.post("/", insert, (req, res, next) => {
  console.log("HELLO FROM THE POST REQUEST!!", req.body);
  res.send({
    code: 201,
    info: "QUOTE INSERTED INTO THE FILE",
  });
});

function insert(req, res, next) {
  console.log("INSERT FUNCTION HURRAY", req.body);
  appendFile(req.body.info);
  next();
}

function appendFile(s) {
  console.log("INSIDE APPEND FILE METHOD", s);
  fs.appendFile(path, `${s}\n`, (err) => {
    if (err) console.log("GETTING ERROR WHILE APPENDING FILE DATA \n");
    else console.log("DATA INSERTED SUCCESSFULLY!!");
  });
}

app.listen(5001, () => {
  console.log("listeningn to hahahha");
});
