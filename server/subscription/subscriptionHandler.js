

// TODO: return a list of subscriptions or a list of products???

// TODO: x-user included???
// TODO: if included, the format?? :: id ? username ? phone ? email ?


//TODO: get product, a list of product

var mongoose = require('mongoose'); 
const nodemailer = require("nodemailer");

var Schema = mongoose.Schema; 

var ObjectId = Schema.ObjectId; 


// product
// get v1/product
// subscription
// get v1/subscription
// return a list of subscriptions
subscriptionGetHandler = async(req, res, {Subscribe}) => {
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
        subscriptions = await Subscribe.find({"userID": user['id']});
        // for loop ? ---> handling
        // products = await Product.find({"productID" : subscriptions[productID]});
        res.json(subscriptions);
    } catch (e) {
        res.status(500).send("subscriptions not found" + user['id'] + user['username']);
    }
};


subscriptionPostHandler = async(req, res, {Subscribe, Product}) => {
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
    const productID = req.body.productID;
    console.log("body: ", req.body)
    console.log("productID: ", productID)
    if (!productID) {
        res.status(400).send("no productname found");
        return;
    }
    // find product ID
    const product = await Product.findOne({"productID": productID});
    console.log("product: ", product)
    if (!product) {
        res.status(400).send("no product named " + productName + " stored in the db");
        return;
    }
    const previousSubscription = await Subscribe.findOne({"productID": productID, "userID": user['id']});
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
    console.log("subscription: ", subscription)

    console.log("sending confirmation email.....")
    sendEmail(user['email'], user['userName'], product.productName);
    // status code send with json created object
    const query = new Subscribe(subscription);
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

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (emailAddr, userName, productName) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "lyons2000124@gmail.com", // generated ethereal user
      pass: "ldysy888", // generated ethereal password
    }
  });
  console.log("tranporter established: ", transporter)
  console.log("EmailAddr: ", emailAddr)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Stock Station" <lyons2000124@gmail.com>', // sender address
    to: emailAddr, // list of receivers format: abc@gmail.com,123@gmail.com
    subject: "StockStation product subscription confrimation", // Subject line
    text: "Hello " + userName + ", You have successfully subscribed to the product " + `"${productName}"` + "Thanks for using our service and we'll notify you immidiately when the product become available", // plain text body
    html: `<b>Hello ${userName}, You have successfully subscribed to the product "${productName}" Thanks for using our service and we'll notify you immidiately when the product become available</b>` // html body
  });
  console.log("info: ", info)
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = {subscriptionGetHandler, subscriptionPostHandler};