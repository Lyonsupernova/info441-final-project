const { getBestBuy } = require('./scrape')
const { sendEmail } = require('./notification')

productGetHandler = async(req, res, {Product, Subscribe}) => {
    // get url for ps5 at bestbuy
    const exProductName = "Sony PlayStation 5"
    var urls = await Product.find({"productName": exProductName}, function (err, res) {
        if (err) {
            console.log("Something wrong retrieving url: %v", err);
        }
    });
    if (urls.length != 0) {
        for (let i = 0; i < urls.length; i++) {
            getBestBuy(urls[i].productLink)
                .then(available => {
                    console.log(available);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({"availability": available});
                    if (available) {
                        sendEmail(urls[i], Subscribe);
                    }
                })
                .catch((err) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(400).json({"error": err});
                })
        }
    } else {
        res.status(204).send("Unable to find the url for this product");
    }


    //getWalmart(url)
    //    .then(available => {
    //        res.writeHead(200, {'Content-Type': 'application/json'});
    //        res.write(JSON.stringify({"availability": available}));
    //        res.end();
    //        sendEmail();
    //    })
    //    .catch((err) => {
    //        res.writeHead(400, {'Content-Type': 'application/json'})
    //        res.write(JSON.stringify({"error": err}));
    //        res.end();
    //    })
};

module.exports = {productGetHandler};