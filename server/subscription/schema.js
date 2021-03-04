const Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;
const productSchema = new Schema({
    productID: {type: ObjectId, required: true, unique: true, auto: true},
    productName: {type: String, unique: true, required: true},
    productLink: String
});

//TODO: optimization: do we need to make product a list, 
//TODO: e.g: product: {[productID:1, productName: "ps5"], [productID:2, productName: "xbox"]}
const subscribeSchema = new Schema({
    subscribeID: {type: ObjectId, required: true, unique: true, auto: true},
    userID: {type: ObjectId, required: true},
    productID: {type: ObjectId, required: true},
    productName: {type: String, required: false},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    subscribePref: {type: String, required: false},
    createdAt: {type: Date, required: true},
    editedAt: Date
});

// const subscribeSchema = new Schema({
//     subscribeID: {type: ObjectId, required: true, unique: true, auto: true},
//     userID: {type: ObjectId, required: true},
//     product: {type: [{id: Number, productName: String}]},
//     email: {type: String, required: true},
//     phone: {type: String, required: true},
//     subscribePref: {type: String, required: false},
//     createdAt: {type: Date, required: true},
//     editedAt: Date
// });


module.exports = {productSchema, subscribeSchema};