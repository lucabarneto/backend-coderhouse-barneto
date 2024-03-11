const Cart = require("../models/cart.model.js");

module.exports = {
  addCart: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      await Cart.create(body);

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  getCartProducts: async (cid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cid) {
        throw new Error("No cid provided");
      }

      const cart = await Cart.find({ _id: cid });

      //Verifico que el carrito exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      return cart[0].products;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  addProductToCart: async (cid, pid, quantity) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!pid) {
        throw new Error("No pid provided");
      }

      const cart = await Cart.find({ _id: cid });

      //Verifico que el carrito exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart[0].products.push({ product: pid, quantity });

      await Cart.updateOne({ _id: cid }, cart);

      return cart;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  deleteProduct: async (cid, pid) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!pid) {
        throw new Error("No pid provided");
      }

      await Cart.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );

      return true;
    } catch (err) {
      console.error(err);
    }
  },
  deleteAllProducts: async (cid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cid) {
        throw new Error("No cid provided");
      }

      await Cart.updateOne({ _id: cid }, { $set: { products: [] } });

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  updateProductQuantity: async (cid, pid, quantity) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!pid) {
        throw new Error("No pid provided");
      }
      if (!quantity) {
        throw new Error("No new quantity provided");
      }

      const cart = await Cart.find({ _id: cid });

      //Verifico que el carrito exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      //Aumento la cantidad del producto con el pid específico
      const product = cart[0].products.find((p) => p.product._id == pid);
      product.quantity = quantity;

      await Cart.updateOne({ _id: cid }, cart);

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  updateCart: async (cid, arr) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!arr) {
        throw new Error("No array provided");
      }
      //Verifico que el cuerpo pasado sea un array
      if (!Array.isArray(arr)) {
        throw new TypeError("Body must be an array");
      }

      await Cart.updateOne(
        { _id: cid },
        { $addToSet: { products: { $each: arr } } }
      );

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
};
