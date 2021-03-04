const mongoose = require('mongoose')
const express = require('express')
const {channelSchema, messageSchema} = require('./schemas')
const Product = mongoose.model("Product", productSchema)
const Subscription = mongoose.model("Subscribe", subscribeSchema)
// const port = 4000
// const mongoPort = process.env.MONGOPORT;
// const mongoEndPoint = "mongodb://localhost:27017/test"
const mongoEndPoint = process.env.MONGOADDR
const port = process.env.PORT;
const app = express();
app.use(express.json());

const connect = () => {
    mongoose.connect(mongoEndPoint, {useNewUrlParser:true});
}
connect();

app.listen(port, "", () => {
    console.log(`server is listening ${port}`);
})
const {
    subscriptionGetHandler,
    subscriptionPostHandler
} = require('./subscriptionHandler')


const {specificSubscriptionPatchHandler,
    specficSubscriptionDeleteHandler} = require('./specificSubscriptionHandler');
    
const RequestWrapper = (handler, SchemeAndDBForwarder) => {
    return (req, res) => {
        handler(req, res, SchemeAndDBForwarder);
    }
};

app.get("/v1/subscribe", RequestWrapper(subscriptionGetHandler, { Subscription }))
app.post("/v1/subscribe", RequestWrapper(subscriptionPostHandler, { Subscription, Product }))
app.patch("/v1/subscribe/:subscriptionID", RequestWrapper(specificSubscriptionPatchHandler, { Subscription }))
app.delete("/v1/subscribe/:subscriptionID", RequestWrapper(specficSubscriptionDeleteHandler, { Subscription }))
