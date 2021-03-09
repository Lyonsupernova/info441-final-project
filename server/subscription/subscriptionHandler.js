

// TODO: return a list of subscriptions or a list of products???

// TODO: x-user included???
// TODO: if included, the format?? :: id ? username ? phone ? email ?


//TODO: get product, a list of product

var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var ObjectId = Schema.ObjectId; 


// product
// get v1/product
// subscription
// get v1/subscription
// return a list of subscriptions
subscriptionGetHandler = async(req, res, {Subscription}) => {
    if (!req.get('X-User')) {
        res.status(401).send("unauthorized user (debugging: x-user:" + req.get('X-User'));
        return;
    }
    // parse x-user to get user id
    const user = JSON.parse(req.get('X-User'));
    if (!user) {
        res.status(401).send("no user found, (debugging: user: " +
        user + " username: " + user['username'] + " id: " + user['id'] + user['email']);
        return;
    }
    try {
        res.setHeader("Content-Type", "application/json");
        // return a list of subscriptions
        subscriptions = await Subscription.find({"userID": user['id']});
        // for loop ? ---> handling
        // products = await Product.find({"productID" : subscriptions[productID]});
        console.log(subscriptions);
        res.json(subscriptions);
    } catch (e) {
        res.status(500).send("subscriptions not found" + user['id'] + users['username']);
    }
};


subscriptionPostHandler = async(req, res, {Subscription, Product}) => {
    if (!req.get('X-User')) {
        res.status(401).send("unauthorized user (debugging: x-user:" + req.get('X-User'));
        return;
    }
    // parse x-user to get user id
    const user = JSON.parse(req.get('X-User'));
    if (!user) {
        res.status(401).send("no user found");
        return;
    }
    // input: ps4
    // mongodb (id:1, ps4, productlink: www.ps4.com)
    // productid
    const {productID} = req.body;
    if (!productID) {
        res.status(400).send("no productname found");
        return;
    }
    // find product ID
    const product = await Product.findOne({"productID": productID});
    if (!product) {
        res.status(400).send("no product named " + productName + " stored in the db");
        return;
    }
    const previousSubscription = await Subscription.findOne({"productID": productID, "userID": user['id']});
    if (previousSubscription) {
        res.status(400).send("The subscription has already existed" + previousSubscription);
        return;
    }
    // created time
    const createdAt = new Date();
    const subscription = {
        "userID": user['id'],
        "productID": productID,
        "productName": product.productName,
        "email": user['email'],
        "createdAt": createdAt,
        "productLink": product['productLink'],
        "imageLink": product['imageLink']
    };
    // status code send with json created object
    const query = new Subscription(subscription);
    query.save((err, newSubscription) => {
        if (err) {
            res.status(400).send('unable to create a new subscription' + err);
            return;
        }
        res.setHeader('Content-Type', "application/json");
        res.status(201).json(newSubscription);
        return;
    });
};

module.exports = {subscriptionGetHandler, subscriptionPostHandler};