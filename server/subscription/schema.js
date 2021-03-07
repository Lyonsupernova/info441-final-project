const Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;
// mongoDB, docker ===> run (exec...)
const productSchema = new Schema({
    productID: {type: ObjectId, required: true, unique: true, auto: true},
    productName: {type: String, unique: true, required: true},
    productLink: String
});

// input: ps4 ==> subscribe, ps4==> productName, 
const subscribeSchema = new Schema({
    subscribeID: {type: ObjectId, required: true, unique: true, auto: true},
    userID: {type: ObjectId, required: true},
    productID: {type: ObjectId, required: true},
    productName: {type: String, required: false},
    email: {type: String, required: true},
    productLink: {type: string, required: false},
    createdAt: {type: Date, required: true},
    editedAt: Date
});


module.exports = {productSchema, subscribeSchema};