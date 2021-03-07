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