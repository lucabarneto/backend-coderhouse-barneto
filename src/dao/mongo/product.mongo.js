const Product = require("../../models/product.model.js");

class ProductMongo {
  constructor() {}

  get = async (data) => {
    try {
      const product = await Product.findOne(data);
      return { status: "success", payload: product[0] };
    } catch (err) {
      return { status: "error", payload: null };
    }
  };

  getAll = async () => {
    try {
      const products = await Product.find();
      return { status: "success", payload: products };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  getById = async (id) => {
    try {
      const product = await Product.find({ _id: id });
      return { status: "success", payload: product[0] };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  create = async (data) => {
    try {
      const product = await Product.create(data);
      return { status: "success", payload: product };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      await Product.updateOne(data, update);
      return { status: "success", payload: "Product updated successfully" };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  delete = async (data) => {
    try {
      await Product.deleteOne(data);
      return { status: "success", payload: "Product deleted successfully" };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  paginate = async (queries, options) => {
    try {
      const products = await Product.paginate(queries, options);
      return { status: "success", payload: products };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };
}

module.exports = ProductMongo;
