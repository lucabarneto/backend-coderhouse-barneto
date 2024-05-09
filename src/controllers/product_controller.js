const ProductService = require("../services/product_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js"),
  faker = require("../utils/faker.js");

const productService = new ProductService();

class productController {
  //handlePid se emplea sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    try {
      const product = await productService.getProductById(pid);

      if (!product.status) {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(pid, "products"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      } else {
        req.product = product.payload;
      }

      next();
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  getProducts = async (req, res) => {
    try {
      let limit = req.query.limit || 10,
        page = req.query.page || 1,
        sort = req.query.sort || 0,
        queries = req.query;

      const products = await productService.getProducts();

      if (!products.status) {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("getProducts", products.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }

      if (
        limit.toString().match(/\d/) === null ||
        page.toString().match(/\d/) === null ||
        sort.toString().match(/\d/) === null ||
        limit <= 0 ||
        page <= 0 ||
        page > Math.ceil(products.length / limit) ||
        (sort !== 1 && sort !== -1 && sort !== 0)
      ) {
        let errorOpts = {
          limit,
          page,
          sort,
          plength: products.payload.length,
        };

        CustomError.createCustomError({
          name: "Incorrect pagination Error",
          cause: infoError.productPaginationErrorInfo(errorOpts),
          message: "There was an error trying to paginate products",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      //Me quedo con los filtros en el objeto queries
      for (const q in queries) {
        if (q !== "category" && q !== "stock") delete queries[q];
      }

      //Si se proveyó un valor para sort se coloca ese valor
      const isSorted = {};
      if (sort !== 0) isSorted.price = parseInt(sort);

      const paginated = await productService.paginateProducts(queries, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: isSorted,
      });

      if (paginated.status) {
        return res.sendCreatedSuccess(paginated.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("getProducts", paginated.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  getProductById = async (req, res) => {
    return req.product;
  };

  addProduct = async (req, res) => {
    try {
      if (!req.body) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("addProduct", [req.body]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productService.addProduct(req.body);

      if (product.status) {
        return res.sendCreatedSuccess(product.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  updateProduct = async (req, res) => {
    try {
      if (!req.body) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("updateProduct", [
            req.body,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productService.updateProduct(req.product, req.body);

      if (product.status) {
        return res.sendCreatedSuccess(product.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const product = await productService.deleteProduct(req.product);

      if (product.status) {
        return res.sendSuccess(product.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  createMockProducts = (req, res) => {
    let products = faker.generateMockProducts(100);
    return res.sendSuccess(products);
  };
}

module.exports = productController;
