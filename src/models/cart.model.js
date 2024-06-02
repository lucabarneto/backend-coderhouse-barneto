const mongoose = require("mongoose"),
  paginate = require("mongoose-paginate-v2");

const CART_COLLECTION = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        match: /^[a-f\d]{24}$/i,
      },
      quantity: {
        type: Number,
        match: /^(?!0)\d+$/,
      },
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate("products.product");
});

cartSchema.plugin(paginate);

const CartModel = mongoose.model(CART_COLLECTION, cartSchema);

module.exports = CartModel;
