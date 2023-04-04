const cheerio = require("cheerio");
const { uuid } = require("uuidv4");
var htmlFunctions = require("../src/functions/storeFunc");
var url1 = [
  "https://www.theiconic.com.au/mens-shoes-sneakers-sale/",
  "https://www.theiconic.com.au/mens-clothing-coats-jackets-sale",
  "https://www.theiconic.com.au/mens-accessories-sale/",
  "https://www.theiconic.com.au/mens-clothing-pants-sale",
  "https://www.theiconic.com.au/mens-clothing-tshirts-singlets-sale",
  "https://www.theiconic.com.au/mens-clothing-shirts-polos-sale",
  "https://www.theiconic.com.au/womens-shoes-sale/",
  "https://www.theiconic.com.au/womens-clothing-dresses-sale/",
  "https://www.theiconic.com.au/womens-clothing-pants-sale",
  "https://www.theiconic.com.au/womens-clothing-jeans-sale",
  "https://www.theiconic.com.au/womens-accessories-sale/",
];

const useHeadless = true;
const maxVisits = 1000;
const visited = new Set();
const allProducts = [];

const fileData = htmlFunctions.loadJSON("db.json");

const extractContent = ($) =>
  $("div.product")
    .map((_, product) => {
      const $product = $(product);
      const $type = $("div.catalog-submenu");

      return {
        id: uuid(),
        type: $type
          .find("ul.breadcrumbs > li > a")
          .last()
          .text()
          .replace(/[/ \r\n]+/g, ""),

        gender: $type
          .find("ul.breadcrumbs > li:nth-child(1) > a")
          .last()
          .text()
          .replace(/[/ \r\n]+/g, ""),
        brand:
          $product.find("span.brand").text().charAt(0).toUpperCase() +
          $product.find("span.brand").text().slice(1),

        title:
          $product.find("span.name").text().charAt(0).toUpperCase() +
          $product.find("span.name").text().slice(1),
        click:
          "www.theiconic.com.au" +
          $product.find("a.product-image-link").attr("href"),
        img: $product.find("img").attr("src"),
        img1: $product.find("img").attr("data-src"),
        priceOG:
          ($product.find("span.original").text().replace(/\D+/g, "") * 1) / 100,
        priceFL:
          ($product.find("span.final").text().replace(/\D+/g, "") * 1) / 100,
        priceCurr1: $product.find("div.price ").text(),
      };
    })
    .toArray();

const extractLinks = ($) => [
  ...new Set(
    $("ul.pagination > li > a")
      .map((_, a) => "https://www.theiconic.com.au" + $(a).attr("href"))
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
    .filter((link) => !visited.has(link))
    .forEach((link) => {
      q.enqueue(crawlTask, link);
    });
  allProducts.push(...content);

  const mShoeList = htmlFunctions.filterProducts("Sneakers", "Men", ...content);
  const mJacketList = htmlFunctions.filterProducts(
    "Coats&Jackets",
    "Men",
    ...content
  );

  const mAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Men",
    ...content
  );
  const mPantsList = htmlFunctions.filterProducts("Pants", "Men", ...content);
  const mTopsList = htmlFunctions.filterProducts(
    "T-shirts&Singlets",
    "Men",
    ...content
  );
  const mPoloTopsList = htmlFunctions.filterProducts(
    "Shirts&Polos",
    "Men",
    ...content
  );
  const wShoeList = htmlFunctions.filterProducts("Shoes", "Women", ...content);
  const wDressList = htmlFunctions.filterProducts(
    "Dresses",
    "Women",
    ...content
  );

  const wPantsList = htmlFunctions.filterProducts("Pants", "Women", ...content);
  const wJeansList = htmlFunctions.filterProducts("Jeans", "Women", ...content);

  const wAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Women",
    ...content
  );

  const urlFunctions = [
    () => fileData.shoes.push(...mShoeList),
    () => fileData.clothes.push(...mJacketList),
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
