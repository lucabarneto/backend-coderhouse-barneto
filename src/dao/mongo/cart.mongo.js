const Cart = require("../../models/cart.model");

class CartMongo {
  constructor() {}

  get = async (data) => {
    try {
      const cart = await Cart.find(data);
      return { status: "success", payload: cart[0] };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  getById = async (id) => {
    try {
      const cart = await Cart.find({ _id: id });
      return { status: "success", payload: cart[0] };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  create = async () => {
    try {
      const cart = await Cart.create({});
      return { status: "success", payload: cart };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      const cart = await Cart.updateOne(data, update);
      return {
        status: "success",
        payload: "Cart updated successfully",
      };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  delete = async (data) => {
    try {
      const cart = await Cart.deleteOne(data);
      return {
        status: "success",
        payload: "Cart deleted successfully",
      };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };
}

module.exports = CartMongo;
