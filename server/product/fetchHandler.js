productGetHandler = async(req, res, {Product}) => {
    // get url for ps5 at bestbuy
    const exProductName = "Sony - Playstation 5 Console"
    var urls = await Product.find({"productName": exProductName}, {"productLink": 1}, function (err, res) {
        if (err) {
            console.log("Something wrong retrieving url: %v", err);
        }
    });
    if (urls.length != 0) {
        for (let i = 0; i < urls.size(); i++) {
            console.log("hello world!!!!")
            getBestBuy(urls[i].productLink)
                .then(available => {
                    console.log("availableavailable!!!!!")
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify({"availability": available}));
                    sendEmail(exProductName, Subscription);
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    console.log(err);
                    res.write(JSON.stringify({"error hahahahah": err}));
                    res.end();
                })
        }
    } else {
        console.log("Unable to find the url!!!!!")
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