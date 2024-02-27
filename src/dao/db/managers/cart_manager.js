const cartModel = require("../models/cart.model.js"),
  pm = require("./product_manager.js");

module.exports = {
  addCart: async (body) => {
    try {
      await cartModel.create(body);

      return true;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
  getCartProducts: async (cid) => {
    try {
      const cart = await cartModel.find({ _id: cid }, { products: 1 });

      if (!cart) {
        throw new Error("Cart not found");
      }

      return cart;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
  addProductToCart: async (cid, pid) => {
    try {
      const product = await pm.getProductById(pid);

      if (!product) {
        throw new Error("Product not found");
      }

      await cartModel.updateOne(
        { _id: cid },
        { $addToSet: { products: product } }
      );

      return true;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
};
