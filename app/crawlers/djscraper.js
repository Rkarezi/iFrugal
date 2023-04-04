const cheerio = require("cheerio");
const { uuid } = require("uuidv4");
var htmlFunctions = require("../src/functions/storeFunc");
var url1 = [
  "https://www.davidjones.com/sale/men/shoes",
  "https://www.davidjones.com/sale/men/clothing/coats-and-jackets",
  "https://www.davidjones.com/sale/men/clothing/chinos-and-pants",
  "https://www.davidjones.com/sale/men/clothing/jeans",
  "https://www.davidjones.com/sale/men/accessories",
  "https://www.davidjones.com/sale/men/clothing/t-shirts",
  "https://www.davidjones.com/sale/men/clothing/polo-shirts",
  "https://www.davidjones.com/sale/shoes/womens-shoes",
  "https://www.davidjones.com/sale/women/clothing/dresses",
  "https://www.davidjones.com/sale/women/clothing/pants-and-shorts",
  "https://www.davidjones.com/sale/women/clothing/jeans-and-denim",
  "https://www.davidjones.com/sale/bags-and-accessories/womens-accessories",
];

const useHeadless = true;
const maxVisits = 1000;
const visited = new Set();
const allProducts = [];

const fileData = htmlFunctions.loadJSON("db.json");

const extractContent = ($) =>
  $("div.item ")
    .map((_, product) => {
      const $product = $(product);

      const $type = $("ul.breadcrumb > li:nth-child(4)").first();
      const $gender = $("ul.breadcrumb > li:nth-child(3)").first();
      const $type1 = $("ul.breadcrumb > li").last();

      return {
        id: uuid(),

        type1: $type
          .find("span")

          .text(),
        gender: $gender.find("span").text() != "Men" ? "Women" : "Men",

        type: $type1.find("span").text(),

        brand:
          $product
            .find("div.item-detail > div.item-brand")
            .text()
            .charAt(0)
            .toUpperCase() +
          $product.find("div.item-detail > div.item-brand").text().slice(1),

        title:
          $product.find("div.item-detail > h4").text().charAt(0).toUpperCase() +
          $product.find("div.item-detail > h4").text().slice(1),
        priceOG:
          ($product.find("div.pricing > p.was").text().replace(/\D+/g, "") *
            1) /
          100,
        priceFL:
          ($product.find("div.pricing > p.now").text().replace(/\D+/g, "") *
            1) /
          100,
        priceCurr:
          ($product
            .find("div.pricing > p.price > span.price-display")
            .text()
            .replace(/\D+/g, "") *
            1) /
          100,

        img:
          "https://www.davidjones.com" +
          $product.find("figure > a > img").attr("src"),

        click: $product.find("figure > a").attr("href").replace("https://", ""),
      };
    })
    .toArray();

const extractLinks = ($) => [
  ...new Set(
    $("div.page-numbers  > ul > li.next > a")
      .map((_, a) => "https://www.davidjones.com" + $(a).attr("href"))
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

  content.map((item) => {
    if (item.priceFL === 0) {
      item.priceFL = item.priceCurr;
    }
  });

  const mShoeList = htmlFunctions.filterProducts("Shoes", "Men", ...content);
  const mPantsList = htmlFunctions.filterProducts(
    "Chinos & Pants",
    "Men",
    ...content
  );
  const mJacketList = htmlFunctions.filterProducts(
    "Coats & Jackets",
    "Men",
    ...content
  );
  const mJeansList = htmlFunctions.filterProducts("Jeans", "Men", ...content);
  const mAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Men",
    ...content
  );
  const mTopsList = htmlFunctions.filterProducts("T-Shirts", "Men", ...content);
  const mPoloTopsList = htmlFunctions.filterProducts(
    "Polo Shirts",
    "Men",
    ...content
  );
  const wShoeList = htmlFunctions.filterProducts(
    "Women's Shoes",
    "Women",
    ...content
  );
  const wPantsList = htmlFunctions.filterProducts(
    "Pants & Shorts",
    "Women",
    ...content
  );
  const wDressList = htmlFunctions.filterProducts(
    "Dresses",
    "Women",
    ...content
  );
  const wJeansList = htmlFunctions.filterProducts(
    "Jeans & Demin",
    "Women",
    ...content
  );
  const wAcsList = htmlFunctions.filterProducts(
    "Women's Accessories",
    "Women",
    ...content
  );

  const urlFunctions = [
    () => fileData.shoes.push(...mShoeList),
    () => fileData.clothes.push(...mPantsList),
    () => fileData.clothes.push(...mJacketList),
    () => fileData.clothes.push(...mJeansList),
    () => fileData.accessories.push(...mAcsList),
    () => fileData.clothes.push(...mTopsList),
    () => fileData.clothes.push(...mPoloTopsList),
    () => fileData.shoes.push(...wShoeList),
    () => fileData.clothes.push(...wPantsList),
    () => fileData.clothes.push(...wDressList),
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
