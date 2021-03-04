

// TODO: return a list of subscriptions or a list of products???

// TODO: x-user included???
// TODO: if included, the format?? :: id ? username ? phone ? email ?
subscriptionGetHandler = async(req, res, {Subscription}) => {
    if (!req.get('X-User')) {
        res.status(401).send("unauthorized user (debugging: x-user:" + req.get('X-User'));
        return;
    }
    // parse x-user to get user id
    const user = JSON.parse(req.get('X-User'));
    if (!user || !user['username'] || !user['id']) {
        res.status(401).send("no user found, (debugging: user: " +
        user + " username: " + user['username'] + " id: " + user['id']);
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
    // TODO: x-user provided with email and phone number????
    if (!user || !user['username'] || !user['id'] || !user['phone'] || !user['email']) {
        res.status(401).send("no user found");
        return;
    }
    const {productName, subscribePref} = req.body;
    if (!productName) {
        res.status(400).send("no productname found");
        return;
    }
    // find product ID
    const product = await Product.find({"productName": productName});
    if (!product) {
        res.status(400).send("no product named " + productName + " stored in the db");
        return;
    }
    // created time 
    const createdAt = new Date();

    // TODO: if not connected with MySQL, how to fetch the user data? MYSQL connection needed?
    // TODO: created an array of products instead???
    const subscription = {
        "userID": user['id'],
        "productID": product['productID'],
        "productName": productName,
        "email": user['email'],
        "phone": user['phone'],
        "subscribePref": subscribePref,
        "createdAt": createdAt
    };
    // status code send with json created object
    const query = new Subscription(subscription);
    query.save((err, newSubscription) => {
        if (err) {
            res.status(400).send('unable to create a new channel' + err);
            return;
        }
        res.setHeader('Content-Type', "application/json");
        res.status(201).json(newSubscription);
        return;
    });
};

module.exports = {subscriptionGetHandler, subscriptionPostHandler};