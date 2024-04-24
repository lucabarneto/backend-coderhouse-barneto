const ProductDAO = require("../dao/mongo/product.mongo");

const productDAO = new ProductDAO();

class ProductService {
  constructor() {}

  //Obtiene un producto
  getProductById = async (pid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!pid) {
        throw new Error("No pid provided");
      }
      const product = await productDAO.getById(pid);

      if (product.status) {
        return { status: true, payload: product.payload };
      } else {
        throw new Error(product.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Obtiene todos los productos
  getProducts = async (limit = 10, page = 1, sort = 0, queries) => {
    try {
      //Valido que los parámetros pasados sean números
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

      const products = await productDAO.get();

      //Verifico que los productos existan
      if (!products.status) {
        throw new Error(products.error);
      }

      //Valido que el valor de page exista dentro de los valores de la paginación
      if (page > Math.ceil(products.length / limit))
        throw new RangeError("Page doesn't exist");

      const paginated = await productDAO.paginate(queries, {
        limit,
        page,
        sort: isSorted,
      });
      if (paginated.status) {
        return { status: true, payload: paginated.payload };
      } else {
        throw new Error(paginated.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Añade un producto
  addProduct = async (product) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!product) {
        throw new Error("Product not provided");
      }

      const createdProduct = await productDAO.create(product);

      if (createdProduct.status) {
        return { status: true, payload: createdProduct.payload };
      } else {
        throw new Error(createdProduct.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Actualiza un producto
  updateProduct = async (product, body) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!product) {
        throw new Error("Product not provided");
      }
      if (!body) {
        throw new Error("Body not provided");
      }

      const update = await productDAO.update(product, body);

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Elimina un producto
  deleteProduct = async (product) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!product) {
        throw new Error("Product not provided");
      }

      const deleted = await productDAO.delete(product);

      if (deleted.status) {
        return { status: true, payload: deleted.payload };
      } else {
        throw new Error(deleted.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };
}

module.exports = ProductService;
