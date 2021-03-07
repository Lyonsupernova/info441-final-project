const express = require('express');
const app = express();
const port = 3000;

const { getBestBuy, getWalmart } = require('./scrape')
const { sendEmail } = require('./notification')

app.get('/products', function(req, res) {

    const url = req.query.url;

    // getBestBuy(url)
    //     .then(available => {
    //         res.writeHead(200, {'Content-Type': 'application/json'});
    //         res.write(JSON.stringify({"availability": available}));
    //         res.end();
    //         sendEmail();
    //     })
    //     .catch((err) => {
    //         res.writeHead(400, {'Content-Type': 'application/json'})
    //         res.write(JSON.stringify({"error": err}));
    //         res.end();
    //     })
    
    getWalmart(url)
        .then(available => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({"availability": available}));
            res.end();
            //sendEmail();
        })
        .catch((err) => {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.write(JSON.stringify({"error": err}));
            res.end();
        })
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
