const { fork } = require("child_process");
const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const axios = require("axios");
const router = jsonServer.router("./db.json");
var storeFunction = require("./src/functions/storeFunc");
const fs = require("fs");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

var completedVal;
var terminateProcess;
var promStores;
var selectStore;
var readyMsg;

io.once("connection", (client) => {
  terminateProcess = -1;
  completedVal = -1;
  client.once("disconnect", () => {
    terminateProcess = 0;
  });
});

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.get("/terminateProcess", function (req, res) {
  if (terminateProcess == 0) {
    res.send("0");
  } else {
    res.send("-1");
  }
});

server.get("/scrapeStatus", function (req, res) {
  if (completedVal == 0) {
    res.send("Completed");
    process.exit(0);
  } else {
    completedVal = -1;
    res.send("Incomplete");
  }
});

server.get("/saveReady", function (req, res) {
  if (selectStore != undefined) {
    selectStore.once("message", function (message) {
      readyMsg = message;
    });

    res.send(readyMsg);
  } else {
    res.send("Store not avaliable");
  }
});

server.post("/stores", function (req, res) {
  const chosenStores = req.body.data;

  if (chosenStores == 0) {
    selectStore = fork("./crawlers/mtscraper.js");
    promStores = storeFunction.storeProcess(selectStore);
  }

  if (chosenStores == 1) {
    selectStore = fork("./crawlers/tiscraper.js");
    promStores = storeFunction.storeProcess(selectStore);
  }
  if (chosenStores == 2) {
    selectStore = fork("./crawlers/djscraper.js");
    promStores = storeFunction.storeProcess(selectStore);
  }
  if (chosenStores == 3) {
    selectStore = fork("./crawlers/gsscraper.js");
    promStores = storeFunction.storeProcess(selectStore);
  }

  promStores
    .then(async () => {
      completedVal = 0;
      promStores;
      const getTerminate = await axios.get(
        "http://localhost:3004/terminateProcess"
      );
      res.send("Store successfully scraped");
      if (getTerminate.data == "0") {
        process.exit(0);
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

server.post("/clear", function (req, res) {
  const clearDB = fork("./src/functions/config.js");
  clearDB.on("exit", (code) => {
    if (code === 0) {
      res.send("Database cleared");
    } else {
      storeFunction.clearFiles("db.json");
      res.send("Error clearing database process code: ", code);
    }
    process.exit(0);
  });
});

server.use(router);
server.listen(3004, () => {
  console.log("JSON-Server running on port 3004 with PID:", process.pid);
  const dbCheck = fs.statSync("db.json");
  if (dbCheck.size === 0) {
    console.log("DB is empty, reconfiguring");
    storeFunction.clearFiles("db.json");
  }
});
