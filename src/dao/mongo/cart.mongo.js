const Cart = require("../../models/cart.model");

class CartMongo {
  constructor() {}

  get = async (data) => {
    try {
      const cart = await Cart.find(data);
      return { status: true, payload: cart[0] };
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

  create = async (data) => {
    try {
      const cart = await Cart.create(data);
      return { status: true, payload: cart };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      await Cart.updateOne(data, update);
      return { status: true, payload: "Cart updated successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  delete = async (data) => {
    try {
      await Cart.deleteOne(data);
      return { status: true, payload: "Cart deleted successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = CartMongo;
