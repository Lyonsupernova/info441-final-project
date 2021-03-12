const express = require('express');
const mongoose = require('mongoose')
const mongoEndPoint = process.env.MONGOADDR
const {productSchema, subscribeSchema} = require('./schemas')
var Product = mongoose.model("Product", productSchema)
var Subscribe = mongoose.model("Subscribe", subscribeSchema)

const app = express();
const port = 80;
app.use(express.json());

const { getBestBuy, getWalmart } = require('./scrape')
const { sendEmail } = require('./notification')


// '/producst' end point
app.get('/products', async(req, res) => {

    // connect to mongodb
    const connect = () => {
        mongoose.connect(mongoEndPoint, {useNewUrlParser:true});
    }
    connect();

    // get url for ps5 at bestbuy
    const exProductName = "Sony - Playstation 5 Console"
    var urls = await Product.find({"productName": exProductName}, {"productLink": 1}, function (err, res) {
        if (err) {
            console.log("Something wrong retrieving url: %v", err);
        }
    });


    if (urls.length != 0) {
        for (let i = 0; i < urls.size(); i++) {
            getBestBuy(urls[i].productLink)
                .then(available => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify({"availability": available}));
                    sendEmail(exProductName, Subscription);
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    console.log(err);
                    res.write(JSON.stringify({"error": err}));
                    res.end();
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

app.listen(port, "", () => {
    console.log(`server is listening ${port}`);
});

module.exports = {
    fetchProducts
}
