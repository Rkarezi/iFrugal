const fs = require("fs");
const DB = "./db.json";

fs.writeFile(
  DB,
  JSON.stringify({ shoes: [], clothes: [], accessories: [] }),
  function writeJSON(err) {
    if (err) return console.log(err);
    console.log("resetting database " + DB);
  }
);
