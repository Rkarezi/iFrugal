const cheerio = require("cheerio");
const { uuid } = require("uuidv4");
var htmlFunctions = require("../src/functions/storeFunc");
var url1 = [
  "https://www.gluestore.com.au/collections/mens-sale-footwear",
  "https://www.gluestore.com.au/collections/mens-sale-hoods-sweats",
  "https://www.gluestore.com.au/collections/mens-sale-pants-jeans",
  "https://www.gluestore.com.au/collections/mens-sale-accessories",
  "https://www.gluestore.com.au/collections/mens-sale-tops",
  "https://www.gluestore.com.au/collections/womens-sale-footwear",
  "https://www.gluestore.com.au/collections/womens-sale-full-body",
  "https://www.gluestore.com.au/collections/womens-sale-tops",
  "https://www.gluestore.com.au/collections/womens-sale-hoods-sweats",
  "https://www.gluestore.com.au/collections/womens-sale-bottoms",
  "https://www.gluestore.com.au/collections/womens-sale-accessories",
];

const useHeadless = true;
const maxVisits = 1000;
const visited = new Set();
const allProducts = [];

const fileData = htmlFunctions.loadJSON("db.json");

const extractContent = ($) =>
  $("div.container div.product__thumbnail")
    .map((_, product) => {
      const $product = $(product);
      const $type = $("ul.inline-list > li").last();
      const $gender = $("ul.inline-list > li:nth-child(2)");

      return {
        id: uuid(),
        brand:
          $product.find("h3").text().charAt(0).toUpperCase() +
          $product.find("h3").text().slice(1),
        title:
          $product
            .find("h4")
            .text()
            .replace(/Mens |Unisex |Womens /, "")
            .charAt(0)
            .toUpperCase() +
          $product
            .find("h4")
            .text()
            .replace(/Mens |Unisex |Womens /, "")
            .slice(1),

        priceOG:
          ($product
            .find("div.product-thumbnail > span.sale > span.was-price > span")
            .first()
            .text()
            .replace(/[/ \r\n]+/g, "")
            .replace(/\D+/g, "") *
            1) /
          100,
        priceFL:
          ($product
            .find("div.product-thumbnail > span.sale > span")
            .first()
            .text()
            .replace(/[/ \r\n]+/g, "")
            .replace(/\D+/g, "") *
            1) /
          100,
        img: $product.find("img").first().attr("src"),
        type: $type.find("span > span").text(),
        gender: $gender.find("a > span").text().replace("s", ""),

        click:
          "www.gluestore.com.au" +
          $product.find("div.image__container a").attr("href"),
      };
    })
    .toArray();

const extractLinks = ($) => [
  ...new Set(
    $("nav.pagination > ul > li > a")
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
    .filter(
      (link) => !visited.has(link) && !link.includes("boost-pfs-original")
    )
    .forEach((link) => {
      q.enqueue(crawlTask, link);
    });

  allProducts.push(...content);
  content.map((item) => {
    item.img = item.img?.replace("50x", "720x");
  });

  const mShoeList = htmlFunctions.filterProducts("Shoes", "Men", ...content);
  const mJacketList = htmlFunctions.filterProducts(
    "Hoodies & sweaters",
    "Men",
    ...content
  );
  const mPantsList = htmlFunctions.filterProducts(
    "Pants & jeans",
    "Men",
    ...content
  );
  const mAcsList = htmlFunctions.filterProducts(
    "Accessories",
    "Men",
    ...content
  );
  const mTopsList = htmlFunctions.filterProducts("Tops", "Men", ...content);

  const wShoeList = htmlFunctions.filterProducts(
    "Womens sale footwear",
    "Women",
    ...content
  );
  const wDressList = htmlFunctions.filterProducts(
    "Womens sale full body",
    "Women",
    ...content
  );
  const wTopsList = htmlFunctions.filterProducts(
    "Womens sale tops",
    "Women",
    ...content
  );
  const wJacketList = htmlFunctions.filterProducts(
    "Womens sale hoods & sweats",
    "Women",
    ...content
  );
  const wPantsList = htmlFunctions.filterProducts(
    "Womens sale bottoms",
    "Women",
    ...content
  );

  const wAcsList = htmlFunctions.filterProducts(
    "Womens sale accessories",
    "Women",
    ...content
  );

  const urlFunctions = [
    () => fileData.shoes.push(...mShoeList),
    () => fileData.clothes.push(...mJacketList),
    () => fileData.clothes.push(...mPantsList),
    () => fileData.accessories.push(...mAcsList),
    () => fileData.clothes.push(...mTopsList),
    () => fileData.shoes.push(...wShoeList),
    () => fileData.clothes.push(...wDressList),
    () => fileData.clothes.push(...wTopsList),
    () => fileData.clothes.push(...wJacketList),
    () => fileData.clothes.push(...wPantsList),
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
