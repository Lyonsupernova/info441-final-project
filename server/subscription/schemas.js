const Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;
// mongoDB, docker ===> run (exec...)
const productSchema = new Schema({
    productID: {type: ObjectId, required: true, unique: true, auto: true},
    productName: {type: String, unique: true, required: true},
    productLink: String,
    description: String,
    imageLink: {type: String, required: true}
});

// input: ps4 ==> subscribe, ps4==> productName, 
const subscribeSchema = new Schema({
    subscribeID: {type: ObjectId, required: true, unique: true, auto: true},
    userID: {type: Number, required: false},
    productID: {type: ObjectId, required: true},
    imageLink: {type: String, required: true},
    productName: {type: String, required: false},
    email: {type: String, required: false},
    productLink: {type: String, required: false},
    createdAt: {type: Date, required: false},
    editedAt: Date
});


module.exports = {productSchema, subscribeSchema};