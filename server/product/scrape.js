const rp = require('request-promise');
const cheerio = require('cheerio');

const getBestBuy = async (url) => {
    //const url = `http://www.localhost.com:3000/products/?url=https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324`
    if (!url.endsWith("&intl=nosplash")) {
        url = url + "&intl=nosplash";
    }
    console.log(`URL: ${url}/`);
    const options = {
        uri: url,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Paw/3.2 (Macintosh; OS X/10.16.0) GCDHTTPRequest",
        },
        transform: (body) => cheerio.load(body)
    };
    const $ = await rp(options);

    const titleText = $(".title").first().text();
    console.log(titleText);

    const btnText = $(".fulfillment-add-to-cart-button").first().text();
    console.log(btnText);

    if (btnText === "") return null;
    return btnText !== "Sold Out";
}

const getWalmart = async (url) => {
    //http://www.localhost:3000/products/?url=https://www.walmart.com/ip/Xbox-Series-X/443574645
    //http://www.localhost:3000/products/?url=https://www.walmart.com/ip/NESTLE-SPLASH-Water-Beverage-with-Natural-Fruit-Flavor-Wild-Berry-Flavor-16-9-fl-oz-Plastic-Bottles-24-Count/49933698?findingMethod=wpa
    console.log(`URL: ${url}/`);
    const options = {
        uri: url,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Paw/3.2 (Macintosh; OS X/10.16.0) GCDHTTPRequest",
        },
        transform: (body) => cheerio.load(body)
    };
    const $ = await rp(options);
    //console.log($.html());
    const outOfStock = $('.prod-blitz-copy-message').first().text();
    const addToCart = $('.prod-ProductCTA--primary').first().text();
    console.log("availability: ", addToCart, outOfStock);
    if (outOfStock === "" && addToCart === "Add to cart") {
        return true;
    } else if (outOfStock === "This item is  out of stock." && addToCart === "") {
        return false;
    }
    return null;
}

const getTarget = async (url) => {
    //http://www.localhost:3000/products/?url=https://www.target.com/p/xbox-series-x-console/-/A-80790841
    //http://www.localhost:3000/products/?url=https://www.walmart.com/ip/NESTLE-SPLASH-Water-Beverage-with-Natural-Fruit-Flavor-Wild-Berry-Flavor-16-9-fl-oz-Plastic-Bottles-24-Count/49933698?findingMethod=wpa
    console.log(`URL: ${url}/`);
    const options = {
        uri: url,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Paw/3.2 (Macintosh; OS X/10.16.0) GCDHTTPRequest",
        },
        transform: (body) => cheerio.load(body)
    };
    const $ = await rp(options);
    console.log($.html());
    // const outOfStock = $('.prod-blitz-copy-message').first().text();
    // const addToCart = $('.prod-ProductCTA--primary').first().text();
    // console.log("availability: ", addToCart, outOfStock);
    // if (outOfStock === "" && addToCart === "Add to cart") {
    //     return true;
    // } else if (outOfStock === "This item is  out of stock." && addToCart === "") {
    //     return false;
    // }
    // return null;
}

module.exports = {
    getBestBuy,
    getWalmart,
    getTarget
}
