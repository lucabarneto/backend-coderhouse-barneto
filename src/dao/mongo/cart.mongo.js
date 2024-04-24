const Cart = require("../../models/cart.model");

class CartMongo {
  constructor() {}

  get = async (cart) => {
    try {
      const found = await Cart.find(cart);
      return { status: true, payload: found[0] };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  getById = async (id) => {
    try {
      const cart = await Cart.find({ _id: id });
      return { status: true, payload: cart[0] };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  create = async (cart) => {
    try {
      const created = await Cart.create(cart);
      return { status: true, payload: created };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (cart, update) => {
    try {
      await Cart.updateOne(cart, update);
      return { status: true, payload: "Cart updated successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  delete = async (cart) => {
    try {
      await Cart.deleteOne(cart);
      return { status: true, payload: "Cart deleted successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = CartMongo;
