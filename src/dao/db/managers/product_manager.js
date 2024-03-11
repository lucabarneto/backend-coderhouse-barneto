const Product = require("../models/product.model.js");

module.exports = {
  getProducts: async (limit, page, sort, queries) => {
    try {
      //Si se proveyó un valor para sort se coloca ese valor
      const isSorted = {};
      if (sort !== 0) {
        isSorted.price = sort;
      }

      const products = await Product.find();

      //Verifico que el producto exista
      if (!products) {
        throw new Error("Products not found");
      }

      const paginated = await Product.paginate(queries, {
        limit,
        page,
        sort: isSorted,
      });

      return { products, paginated };
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  getProductById: async (pid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!pid) {
        throw new Error("No pid provided");
      }
      const product = await Product.findById(pid);

      //Verifico que el producto exista
      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (err) {
      console.error(err);
    }
  },
  addProduct: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      await Product.create(body);

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  updateProduct: async (pid, body) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!pid) {
        throw new Error("No pid provided");
      }
      if (!body) {
        throw new Error("Body not provided");
      }

      await Product.updateOne({ _id: pid }, body);

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  deleteProduct: async (pid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!pid) {
        throw new Error("No pid provided");
      }

      await Product.deleteOne({ _id: pid });

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
};
