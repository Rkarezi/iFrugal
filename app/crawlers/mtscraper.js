const cheerio = require("cheerio");
const { uuid } = require("uuidv4");
var htmlFunctions = require("../src/functions/storeFunc");
var url1 = [
  "https://www.mytheresa.com/en-au/men/sale/best-of-the-rest/shoes.html",
  "https://www.mytheresa.com/en-au/men/sale/best-of-the-rest/clothing/jackets.html",
  "https://www.mytheresa.com/en-au/men/sale/best-of-the-rest/clothing/coats.html",
  "https://www.mytheresa.com/en-au/men/sale/best-of-the-rest/clothing/trousers.html",
  "https://www.mytheresa.com/en-au/men/sale/best-of-the-rest/accessories.html",
  "https://www.mytheresa.com/en-au/men/sale/clothing/t-shirts.html",
  "https://www.mytheresa.com/en-au/men/sale/clothing/polo-shirts.html",
  "https://www.mytheresa.com/en-au/sale/shoes.html",
  "https://www.mytheresa.com/en-au/sale/clothing/dresses.html",
  "https://www.mytheresa.com/en-au/sale/clothing/trousers.html",
  "https://www.mytheresa.com/en-au/sale/clothing/jeans.html",
  "https://www.mytheresa.com/en-au/sale/accessories.html",
];

const useHeadless = false;
const maxVisits = 1000;
const visited = new Set();
const allProducts = [];

const fileData = htmlFunctions.loadJSON("db.json");

const extractContent = ($) =>
  $("li.item")
    .map((_, product) => {
      const $product = $(product);

      const $type1 = $("div.toolbar-top");
      const $gender = $("div.toolbar-top > div.breadcrumbs > ul > li").first();
      return {
        id: uuid(),
        brand:
          $product
            .find("div.product-info > div.product-designer > span.ph1")
            .text()
            .charAt(0)
            .toUpperCase() +
          $product
            .find("div.product-info > div.product-designer > span.ph1")
            .text()
            .slice(1),
        title:
          $product
            .find("div.product-info > h2.product-name > a")
            .text()
            .charAt(0)
            .toUpperCase() +
          $product
            .find("div.product-info > h2.product-name > a")
            .text()
            .slice(1),

        priceOG: parseInt(
          $product
            .find(
              "div.product-info > div.price-container > div.price-box > p.old-price > span.price"
            )
            .text()
            .replace(/\D+/g, "")
        ),

        priceFL: parseInt(
          $product
            .find(
              "div.product-info > div.price-container > div.price-box > p.special-price > span.price"
            )
            .text()
            .replace(/\D+/g, "")
        ),

        img: $product.find("img").attr("data-src"),

        type: $type1.find("div.breadcrumbs > ul > li > span").last().text(),
        gender: $gender.find("span").text(),

        click: $product.find("a").attr("href").replace("https://", ""),
      };
    })
    .toArray();

const extractLinks = ($) => [
  ...new Set(
    $("div.toolbar-top > div.toolbar > div.pager > div.pages > ul > li > a")
      .map((_, a) => $(a).attr("href"))
      .toArray()
  ),
];

const crawl = async (url) => {
  visited.add(url);

  console.log("Crawl: ", url);
  const html = await htmlFunctions.getHtml(url, useHeadless);
  const $ = cheerio.load(html);
  const content = extractContent($);
  const links = extractLinks($);

  links
    .filter((link) => !visited.has(link) && !link.includes("p=1"))
    .forEach((link) => {
      q.enqueue(crawlTask, link);
    });
  allProducts.push(...content);

  const mShoeList = htmlFunctions.filterProducts("Shoes", "Men", ...content);
  const mJacketList = htmlFunctions.filterProducts(
    "Jackets",
    "Men",
    ...content
  );
  const mCoatsList = htmlFunctions.filterProducts("Coats", "Men", ...content);
  const mPantsList = htmlFunctions.filterProducts(
    "Trousers",
    "Men",
    ...content
  );
  const mAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Men",
    ...content
  );
  const mTopsList = htmlFunctions.filterProducts("T-shirts", "Men", ...content);
  const mPoloTopsList = htmlFunctions.filterProducts(
    "Polo Shirt",
    "Men",
    ...content
  );
  const wShoeList = htmlFunctions.filterProducts("Shoes", "Women", ...content);
  const wDressList = htmlFunctions.filterProducts(
    "Dresses",
    "Women",
    ...content
  );

  const wPantsList = htmlFunctions.filterProducts(
    "Trousers",
    "Women",
    ...content
  );
  const wJeansList = htmlFunctions.filterProducts("Jeans", "Women", ...content);

  const wAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Women",
    ...content
  );

  const urlFunctions = [
    () => fileData.shoes.push(...mShoeList),
    () => fileData.clothes.push(...mJacketList),
    () => fileData.clothes.push(...mCoatsList),
    () => fileData.clothes.push(...mPantsList),
    () => fileData.accessories.push(...mAcsList),
    () => fileData.clothes.push(...mTopsList),
    () => fileData.clothes.push(...mPoloTopsList),
    () => fileData.shoes.push(...wShoeList),
    () => fileData.clothes.push(...wDressList),
    () => fileData.clothes.push(...wPantsList),
    () => fileData.clothes.push(...wJeansList),
    () => fileData.accessories.push(...wAcsList),
  ];

  url1.forEach((item, index) => {
    (urlFunctions[index] || (() => {}))();
  });
};

const crawlTask = async (url) => {
  if (visited.size >= maxVisits) {
    console.log("Over Max Visits, exiting");

    return;
  }

  if (visited.has(url)) {
    return;
  }

  await crawl(url).then(() => {
    htmlFunctions.saveJSON("db.json", fileData);
    process.send("SAVE");
  });
};
const q = htmlFunctions.queue();
for (let index = 0; index < url1.length; index++) {
  q.enqueue(crawlTask, url1[index]);
}
