const mongoose = require("mongoose"),
  paginate = require("mongoose-paginate-v2");

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate("products.product");
});

cartSchema.plugin(paginate);

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;
