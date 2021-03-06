// MySQL connection
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

// specificSubscriptionPatchHandler = async function(req, res, {Subscription, Product}) {
//     if (!req.get('X-User')) {
//         res.status(401).send("unauthorized user");
//         return;
//     }
//     const user = JSON.parse(req.get('X-User'));
//     if (!user || !user['username'] || !user['id']) {
//         res.status(401).send("no user found");
//         return;
//     }
//     const subscriptionID = req.params.subscriptionID;
//     const subscription = await Subscription.findOne({"subscribeID" : subscriptionID}).exec();
//     if (!subscription) {
//         res.status(400).send("Subscription not exist subscriptionID");
//         return;
//     }
//     // If the current user isn't the creator of this channel,
//     // respond with the status code 403 (Forbidden).
//     if (subscription['userID'] != user['id']) {
//        res.status(403).send("user not the creator of subscription");
//        return;
//     }
//     // Otherwise, update only the name and/or description using the JSON in the request body and respond with
//     // a copy of the newly-updated channel, encoded as a JSON object.
//     const{productName, subscribePref} = req.body;
//     const editedAt = new Date();
//     const product = await Product.find({"productName": productName});
//     Subscription.findOneAndUpdate({"subscribeID" : subscriptionID}, { $set: {"productID": product['productID'], "productName" : productName, "subscribePref" : subscribePref, "editedAt" : editedAt}}, { new: true }, function(err, data) {
//         if (err) {
//             console.log(err);
//         } else if (!data) {
//             console.log("data not found" + data);
//         } else if (data) {
//             console.log(data);
//             res.setHeader('Content-Type', "application/json");
//             res.json(data);
//         }
//     });

// };

specficSubscriptionDeleteHandler = async function(req, res, {Subscription}) {
    if (!req.get('X-User')) {
        res.status(401).send("unauthorized user");
        return;
    }
    const user = JSON.parse(req.get('X-User'));
    if (!user) {
        res.status(401).send("no user found");
        return;
    }
    // If the current user isn't the creator of this subscription,
    // respond with the status code 403 (Forbidden).
    const subscriptionID = req.params.subscriptionID;
    const subscription = await Subscription.findOne({"subscribeID" : subscriptionID}).exec();
    if (!subscription) {
        res.status(400).send("Subscription not exist subscriptionID");
        return;
    }
    // if (subscription['userID'] != user['id']) {
    //    res.status(403).send("user not the creator of subscription");
    //    return;
    // }
    // delete the channel and all messages related to it.
    // Respond with a plain text message indicating that the delete was successful.
    Subscription.findOneAndDelete({'id' : subscriptionID}, function(err, data) {
        if (err) {
            res.status(400).send("channel not find");
            return;
        }
        res.status(200).send("Deleted channel sucessfully: " + data);
    });
};


module.exports = {specficSubscriptionDeleteHandler};