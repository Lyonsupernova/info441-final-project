const express = require('express');
const mongoose = require('mongoose')
const mongoEndPoint = process.env.MONGOADDR
//const mongoEndPoint="mongodb://localhost:27017/test"
const {productSchema, subscribeSchema} = require('./schemas')
var Product = mongoose.model("Product", productSchema)
var Subscribe = mongoose.model("Subscribe", subscribeSchema)

const app = express();
const port = 80;
app.use(express.json());

const { getBestBuy, getWalmart } = require('./scrape')
const { sendEmail } = require('./notification')
const {productGetHandler} = require('./fetchHandler');
    // connect to mongodb
const connect = () => {
    mongoose.connect(mongoEndPoint, {useNewUrlParser:true});
}
connect();

const RequestWrapper = (handler, SchemeAndDBForwarder) => {
    return (req, res) => {
        handler(req, res, SchemeAndDBForwarder);
    }
};

// '/producst' end point
app.get('/products', RequestWrapper(productGetHandler, { Product, Subscribe }))


// const fetchProducts = async (User, Product) => {
//     getBestBuy(url)
//         .then(available => {
//             res.writeHead(200, {'Content-Type': 'application/json'});
//             res.write(JSON.stringify({"availability": available}));
//             res.end();
//             sendEmail(User, Product);
//         })
//         .catch((err) => {
//             res.writeHead(400, {'Content-Type': 'application/json'})
//             res.write(JSON.stringify({"error": err}));
//             res.end();
//         })

//     getWalmart(url)
//         .then(available => {
//             res.writeHead(200, {'Content-Type': 'application/json'});
//             res.write(JSON.stringify({"availability": available}));
//             res.end();
//             //sendEmail(User, Product);
//         })
//         .catch((err) => {
//             res.writeHead(400, {'Content-Type': 'application/json'})
//             res.write(JSON.stringify({"error": err}));
//             res.end();
//         })
// }

app.listen(port, "", () => {
    console.log(`server is listening ${port}`);
});

module.exports = {
    fetchProducts
}
