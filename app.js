const express = require("express");
const app = express();
const fs = require("fs");
const hls = require("hls-server");

app.get("/", (req, res) => {
  return res.status(200).sendFile(__dirname + "/public/index.html");
});

const server = app.listen(3000);

new hls(server, {
  provider: {
    exists: (req, cb) => {
      console.log("Requesting", req.url);

      const ext = req.url.split(".").pop();

      if (ext !== "m3u8" && ext != "ts") {
        return cb(null, true);
      }

      fs.access(__dirname + req.url, fs.constants.F_OK, (err) => {
        if (err) {
          console.log("File not exist");
          return cb(null, false);
        }
        cb(null, true);
      });
    },
    getManifestStream: (req, cb) => {
      const stream = fs.createReadStream(__dirname + req.url);
      cb(null, stream);
    },
    getSegmentStream: (req, cb) => {
      const stream = fs.createReadStream(__dirname + req.url);
      cb(null, stream);
    },
  },
});
