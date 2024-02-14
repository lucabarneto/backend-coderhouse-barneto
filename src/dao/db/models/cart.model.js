const mongoose = require("mongoose");

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: Array,
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;
