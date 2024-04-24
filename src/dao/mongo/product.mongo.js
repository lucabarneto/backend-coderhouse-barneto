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

  create = async (product) => {
    try {
      const created = await Product.create(product);
      return { status: true, payload: created };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (product, update) => {
    try {
      await Product.updateOne(product, update);
      return { status: true, payload: "Product updated successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  delete = async (product) => {
    try {
      await Product.deleteOne(product);
      return { status: true, payload: "Product deleted successfully" };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  paginate = async (queries, options) => {
    try {
      const paginated = await Product.paginate(queries, options);
      return { status: true, payload: paginated };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = ProductMongo;
