const Cart = require("../../models/cart.model");

class CartMongo {
  constructor() {}

  get = async (data) => {
    try {
      const cart = await Cart.find(data);
      return { status: true, payload: cart[0] };
    } catch (err) {
      return { status: false, error: err.message, details: null };
    }
  };

  getById = async (id) => {
    try {
      const cart = await Cart.find({ _id: id });
      return { status: true, payload: cart[0], details: null };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  create = async (data) => {
    try {
      const cart = await Cart.create(data);
      return { status: true, payload: cart, details: null };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      const cart = await Cart.updateOne(data, update);
      return {
        status: true,
        payload: "Cart updated successfully",
        details: cart,
      };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  delete = async (data) => {
    try {
      const cart = await Cart.deleteOne(data);
      return {
        status: true,
        payload: "Cart deleted successfully",
        details: cart,
      };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = CartMongo;
