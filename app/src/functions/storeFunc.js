const axios = require("axios");
const playwright = require("playwright");
const fs = require("fs");

const getHtmlPlaywright = async (url) => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto(url);
  const html = await page.content();
  await browser.close();

  return html;
};

const getHtmlAxios = async (url) => {
  const { data } = await axios.get(url);

  return data;
};

module.exports = {
  deleteFile: (filename) => {
    fs.unlinkSync(filename, function (err) {
      if (err) return console.log(err);
      else {
        console.log(filename, "file deleted");
      }
    });
  },
  storeProcess: (store) => {
    return new Promise((resolve, reject) => {
      const getTerminate = setInterval(async function () {
        const termProcess = await axios.get(
          "http://localhost:3004/terminateProcess"
        );
        if (termProcess.data == "0") {
          store.kill();
        }
      }, 1000);
      store.once("exit", (code) => {
        clearInterval(getTerminate);
        if (code == 0 || code == null || code == 1) {
          return resolve("success");
        } else {
          return reject("error");
        }
      });
    });
  },

  loadJSON(filename = "") {
    return JSON.parse(fs.readFileSync(filename).toString());
  },

  saveJSON(filename = "", json = '""') {
    return new Promise((resolve, reject) => {
      return fs.writeFileSync(
        filename,
        JSON.stringify(json, null, 2),
        "utf-8",
        function (err) {
          if (err) {
            reject(err);
            return console.log(err);
          }
          resolve("success");
        }
      );
    });
  },

  clearFiles: (file) => {
    fs.writeFile(
      file,
      JSON.stringify({ shoes: [], clothes: [], accessories: [] }),
      function writeJSON(err) {
        if (err) return console.log(err);
        console.log("resetting database " + file);
      }
    );
  },

  getHtml: async (url, headless) => {
    return headless ? await getHtmlPlaywright(url) : await getHtmlAxios(url);
  },
  queue: (concurrency = 4) => {
    let running = 0;
    const tasks = [];

    return {
      enqueue: async (task, ...params) => {
        tasks.push({ task, params });
        if (running >= concurrency) {
          return;
        }

        ++running;
        while (tasks.length) {
          const { task, params } = tasks.shift();
          await task(...params);
        }
        --running;
      },
    };
  },

  filterProducts(type, gender, ...content) {
    return content.filter((product) => {
      return product.type === type && product.gender === gender;
    });
  },
};
