const ProductDAO = require("../dao/mongo/product.mongo"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const productDAO = new ProductDAO();

class ProductService {
  constructor() {}

  //Obtiene un producto
  getProductById = async (pid) => {
    try {
      if (!pid) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Product",
            "getProductById",
            [pid]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productDAO.getById(pid);

      if (product.status) {
        return product;
      } else {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(pid, "products"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Obtiene todos los productos
  getProducts = async (limit = 10, page = 1, sort = 0, queries) => {
    try {
      const products = await productDAO.get();

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
        CustomError.createCustomError({
          name: "Incorrect pagination Error",
          cause: infoError.productPaginationErrorInfo({
            limit,
            page,
            sort,
            plength: products.payload.length,
          }),
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

      const paginated = await productDAO.paginate(queries, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: isSorted,
      });

      if (paginated.status) {
        return paginated;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("getProducts", paginated.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Añade un producto
  addProduct = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Product", "addProduct", [
            data,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productDAO.create(data);

      if (product.status) {
        return product;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Actualiza un producto
  updateProduct = async (data, update) => {
    try {
      if (!data || !update) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Product",
            "updateProduct",
            [data && update]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productDAO.update(data, update);

      if (product.status) {
        return product;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Elimina un producto
  deleteProduct = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Product",
            "deleteProduct",
            ["data"]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const product = await productDAO.delete(data);

      if (product.status) {
        return product;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteProduct", product.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };
}

module.exports = ProductService;
