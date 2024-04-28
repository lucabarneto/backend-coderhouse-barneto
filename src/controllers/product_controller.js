const ProductService = require("../services/product_service.js");

const productService = new ProductService();

class productController {
  //handlePid se emplea sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    const product = await productService.getProductById(pid);

    if (!product.status) {
      req.product = null;
    } else {
      req.product = product.payload;
    }

    next();
  };

  getProducts = async (req, res) => {
    try {
      let limit = req.query.limit || 10,
        page = req.query.page || 1,
        sort = req.query.sort || 0,
        queries = req.query;

      //Valido que los parámetros pasados sean números
      if (limit.toString().match(/[^0-9]/))
        return res.sendUserError("Limit must be a number");
      if (page.toString().match(/[^0-9]/))
        return res.sendUserError("Page must be a number");
      if (sort.toString().match(/[^0-9-]/))
        return res.sendUserError("Sorting order must be a number");

      limit = parseInt(limit);
      page = parseInt(page);
      sort = parseInt(sort);

      //Valido que los parámetros pasados estén dentro del rango establecido
      if (limit <= 0)
        return res.sendUserError(
          "Limit must not be neither 0 nor a negative number"
        );
      if (page <= 0)
        return res.sendUserError(
          "Page must not be neither 0 nor a negative number"
        );
      if (sort !== 1 && sort !== -1 && sort !== 0)
        return res.sendUserError(
          "Sorting order must be either 1 or -1. Skipping sorting order is also a valid option"
        );

      //Me quedo con los filtros en el objeto queries
      for (const q in queries) {
        if (q !== "category" && q !== "stock") delete queries[q];
      }

      const products = await productService.getProducts(
        limit,
        page,
        sort,
        queries
      );

      if (!products.status) {
        return res.sendUserError(products.error);
      }

      if (page > Math.ceil(products.length / limit))
        res.sendUserError("Page doesn't exist");

      //Si se proveyó un valor para sort se coloca ese valor
      const isSorted = {};
      if (sort !== 0) isSorted.price = sort;

      const paginated = await productService.paginateProducts(queries, {
        limit,
        page,
        sort: isSorted,
      });

      if (paginated.status) {
        return res.sendCreatedSuccess(paginated.payload);
      } else {
        return res.sendUserError(paginated.error);
      }
    } catch (err) {
      return res.sendServerError(err);
    }
  };

  getProductById = async (req, res) => {
    try {
      return req.product
        ? res.sendSuccess(req.product)
        : res.sendNotFoundError("Product not found");
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  addProduct = async (req, res) => {
    try {
      if (!req.body) {
        return res.sendUserError("Body not provided");
      }

      const product = await productService.addProduct(req.body);

      if (product.status) {
        return res.sendCreatedSuccess(product.payload);
      } else {
        return res.sendUserError(product.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  updateProduct = async (req, res) => {
    try {
      if (!req.product) {
        return res.sendNotFoundError("Product not found");
      }
      if (!req.body) {
        return res.sendUserError("Body not provided");
      }

      const product = await productService.updateProduct(req.product, req.body);

      if (product.status) {
        return res.sendCreatedSuccess(product.payload);
      } else {
        return res.sendUserError(product.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      if (!req.product) {
        return res.sendNotFoundError("Product not found");
      }

      const product = await productService.deleteProduct(req.product);

      if (product.status) {
        return res.sendSuccess(product.payload);
      } else {
        return res.sendUserError(product.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };
}

module.exports = productController;
