const cartModel = require("../models/cart.model.js");

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
      const cart = await cartModel.findOne({ _id: cid });

      if (!cart) {
        throw new Error("Cart not found");
      }

      return cart.products;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
  addProductToCart: async (cid, pid, quantity) => {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      cart.products.push({ product: pid, quantity });

      await cartModel.updateOne({ _id: cid }, cart);

      const populatedCart = await cartModel.find({ _id: cid });

      return populatedCart;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
  deleteProduct: async (cid, pid) => {
    const cart = await cartModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );

    return cart;
  },
  deleteAllProducts: async (cid) => {
    const cart = await cartModel.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );

    return cart;
  },
  updateProductQuantity: async (cid, pid, quantity) => {
    const cart = await cartModel.findById(cid);

    const product = cart.products.find((p) => p.product._id == pid);
    product.quantity = quantity;

    await cartModel.updateOne({ _id: cid }, cart);

    return true;
  },
  updateCart: async (cid, arr) => {
    const cart = await cartModel.findById(cid);

    arr.forEach((p) => {
      cart.products.push({ product: p._id, quantity: 1 });
    });

    await cartModel.updateOne({ _id: cid }, cart);

    const paginated = await cartModel.paginateSubDocs(
      { _id: cid },
      {
        pagingOptions: {
          populate: {
            path: "products",
          },
        },
      }
    );

    return paginated;
  },
};
