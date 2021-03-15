productPostHandler = async(req, res, {Product}) => {
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
    const {productName, productLink, imageLink, description} = req.body;
    if (!productName) {
        res.status(400).send("no productname found");
        return;
    }

    const product = {
        "productName": productName,
        "productLink": productLink,
        "imageLink": imageLink,
        "description": description
    };
    // status code send with json created object
    const query = new Product(product);
    query.save((err, newProduct) => {
        if (err) {
            res.status(400).send('unable to create a new product' + err);
            return;
        }
        res.setHeader('Content-Type', "application/json");
        res.status(201).json(newProduct);
        return;
    });
};

productGetHandler = async(req, res, {Product}) => {
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
        // return a list of product
        products = await Product.find({});
        console.log(products);
        res.json(products);
    } catch (e) {
        res.status(500).send("products not found" + user['id'] + users['username']);
    }
};

module.exports = {productGetHandler, productPostHandler};