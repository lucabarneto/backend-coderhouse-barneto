const Product = require("../../models/product.model");

class ProductMongo {
  constructor() {}

  get = async () => {
    try {
      const products = await Product.find();
      return { status: true, payload: products };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  getById = async (id) => {
    try {
      const product = await Product.find({ _id: id });
      return { status: true, payload: product[0] };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  create = async (data) => {
    try {
      const product = await Product.create(data);
      return { status: true, payload: product };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      await Product.updateOne(data, update);
      return { status: true, payload: "Product updated successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  delete = async (data) => {
    try {
      await Product.deleteOne(data);
      return { status: true, payload: "Product deleted successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  paginate = async (queries, options) => {
    try {
      const products = await Product.paginate(queries, options);
      return { status: true, payload: products };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = ProductMongo;
