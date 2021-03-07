const express = require('express');
const mongoose = require('mongoose')
const mongoEndPoint = "mongodb://info441MongoDB:27017/subscribe"
const Product = mongoose.model("Product", productSchema)
const Subscription = mongoose.model("Subscribe", subscribeSchema)

const app = express();
const port = 3000;

const { getBestBuy, getWalmart } = require('./scrape')
const { sendEmail } = require('./notification')


// '/producst' end point
app.get('/products', function(req, res) {

    // connect to mongodb
    const connect = () => {
        mongoose.connect(mongoEndPoint, {useNewUrlParser:true});
    }
    connect();

    // get url for ps5 at bestbuy
    const exProductName = "Sony - Playstation 5 Console"
    const url = await Product.findOne({"productName": exProductName})['productLink']
    // TODO: get a list of productname/urls

    getBestBuy(url)
         .then(available => {
             res.writeHead(200, {'Content-Type': 'application/json'});
             res.write(JSON.stringify({"availability": available}));
             res.end();
             sendEmail(exProductName, Subscription);
         })
         .catch((err) => {
             res.writeHead(400, {'Content-Type': 'application/json'})
             res.write(JSON.stringify({"error": err}));
             res.end();
         })

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
});

const fetchProducts = async (User, Product) => {
    getBestBuy(url)
        .then(available => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({"availability": available}));
            res.end();
            sendEmail(User, Product);
        })
        .catch((err) => {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.write(JSON.stringify({"error": err}));
            res.end();
        })

    getWalmart(url)
        .then(available => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({"availability": available}));
            res.end();
            //sendEmail(User, Product);
        })
        .catch((err) => {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.write(JSON.stringify({"error": err}));
            res.end();
        })
}

app.listen(port);

module.exports = {
    fetchProducts
}
