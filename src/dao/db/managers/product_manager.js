const Product = require("../models/product.model.js");

module.exports = {
  getProducts: async (limit = 10, page = 1, sort = 0, queries) => {
    try {
      //Valido que los parámetros paados sean números
      if (limit.toString().match(/[^0-9]/))
        throw new Error("Limit must be a number");
      if (page.toString().match(/[^0-9]/))
        throw new Error("Page must be a number");
      if (sort.toString().match(/[^0-9-]/))
        throw new Error("Sorting order must be a number");

      limit = parseInt(limit);
      page = parseInt(page);
      sort = parseInt(sort);

      //Valido que los parámetros pasados estén dentro del rango establecido
      if (limit <= 0)
        throw new RangeError(
          "Limit must not be neither 0 nor a negative number"
        );
      if (page <= 0)
        throw new RangeError(
          "Page must not be neither 0 nor a negative number"
        );
      if (sort !== 1 && sort !== -1 && sort !== 0)
        throw new RangeError(
          "Sorting order must be either 1 or -1. Skipping sorting order is also a valid option"
        );

      //Me quedo con los filtros en el objeto queries
      for (const q in queries) {
        if (q !== "category" && q !== "stock") delete queries[q];
      }

      //Si se proveyó un valor para sort se coloca ese valor
      const isSorted = {};
      if (sort !== 0) isSorted.price = sort;

      const products = await Product.find();

      //Verifico que el producto exista
      if (!products) {
        throw new Error("Products not found");
      }
      //Valido que el valor de page exista dentro de los valores de la paginación
      if (page > Math.ceil(products.length / limit))
        throw new RangeError("Page doesn't exist");

      const paginated = await Product.paginate(queries, {
        limit,
        page,
        sort: isSorted,
      });

      return { status: true, payload: paginated, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
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

      return { status: true, payload: product, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
  addProduct: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      await Product.create(body);

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
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

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
  deleteProduct: async (pid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!pid) {
        throw new Error("No pid provided");
      }

      await Product.deleteOne({ _id: pid });

      return { status: true, payload: null, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
};
