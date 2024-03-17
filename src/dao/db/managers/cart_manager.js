const { errorMonitor } = require("connect-mongo");
const Cart = require("../models/cart.model.js"),
  productManager = require("../managers/product_manager.js");

module.exports = {
  addCart: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      await Cart.create(body);

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
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

      return { status: true, payload: cart[0].products, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
  addProductToCart: async (cid, pid, quantity = 1) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!pid) {
        throw new Error("No pid provided");
      }
      if (typeof quantity !== "number")
        throw new TypeError("Product's quantity must be a number");
      if (quantity <= 0)
        throw new RangeError(
          "Product's quantity must not be neither 0 nor a negative number"
        );

      const cart = await Cart.find({ _id: cid });

      //Verifico que el carrito exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      //Verifico que la cantidad agregada no sobrepase el stock del producto
      const product = await productManager.getProductById(pid);

      if (!product) {
        throw new Error("Product not found");
      }
      if (quantity > product.stock)
        throw new RangeError(
          `Product's quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      cart[0].products.push({ product: pid, quantity });

      await Cart.updateOne({ _id: cid }, cart[0]);

      return { status: true, payload: cart, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
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

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
  deleteAllProducts: async (cid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cid) {
        throw new Error("No cid provided");
      }

      await Cart.updateOne({ _id: cid }, { $set: { products: [] } });

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
  updateProductQuantity: async (cid, pid, quantity = undefined) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cid) {
        throw new Error("No cid provided");
      }
      if (!pid) {
        throw new Error("No pid provided");
      }
      if (quantity === undefined) {
        throw new Error("No new quantity provided");
      }
      if (typeof quantity !== "number") {
        throw new TypeError("Product's quantity must be a number");
      }
      if (quantity <= 0)
        throw new RangeError(
          "Product's quantity must not be neither 0 nor a negative number"
        );

      const cart = await Cart.find({ _id: cid });

      //Verifico que el carrito exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      //Aumento la cantidad del producto con el pid específico
      const product = cart[0].products.find((p) => p.product._id == pid);

      if (quantity > product.stock)
        throw new RangeError(
          `Product's new quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      product.quantity = quantity;

      await Cart.updateOne({ _id: cid }, cart);

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
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
      if (!(arr instanceof Array)) {
        throw new TypeError("Body must be an array");
      }

      await Cart.updateOne(
        { _id: cid },
        { $addToSet: { products: { $each: arr } } }
      );

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
};
