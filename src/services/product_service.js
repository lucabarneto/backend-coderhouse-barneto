const ProductDAO = require("../dao/mongo/product.mongo"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const productDAO = new ProductDAO();

class ProductService {
  constructor() {}

  addProduct = async (data) => {
    try {
      let {
        title,
        description,
        price,
        code,
        stock,
        category,
        owner,
        thumbnails,
      } = data;

      ParamValidation.isProvided("addProduct", [
        ["title", title],
        ["description", description],
        ["price", price],
        ["code", code],
        ["stock", stock],
        ["category", category],
        ["owner", owner],
      ]);

      ParamValidation.validatePattern(
        "addProduct",
        /^[a-zñáéíóúü0-9-\+/#,\.\$&\(\)\s]+$/i,
        [["title", title]]
      );
      ParamValidation.validatePattern("addProduct", /^(?!0)\d+$/, [
        ["price", price],
        ["stock", stock],
      ]);
      ParamValidation.validatePattern("addProduct", /^\d{5}$/, [
        ["code", code],
      ]);
      ParamValidation.validatePattern(
        "addProduct",
        /^(Anime|Paisajes|Sci-Fi|Abstracto|Retratos)$/,
        [["category", category]]
      );
      ParamValidation.validatePattern(
        "addProduct",
        /(admin|(^[a-f\d]{24}$))/i,
        [["owner", owner]]
      );
      ParamValidation.validateDatatype("addProduct", "array", [
        "thumbnails",
        thumbnails,
      ]);

      const alreadyExists = await productDAO.get(data);
      if (alreadyExists.status === "success")
        CustomError.createCustomError(EErrors.ALREADY_IN_DATABASE, {
          method: "addProduct",
        });

      const product = await productDAO.create(data);
      if (product.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "productDAO.create",
          message: product.error,
        });

      return product;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getProductById = async (pid) => {
    try {
      ParamValidation.isProvided("getProductById", [["pid", pid]]);
      ParamValidation.validatePattern("getProductById", /^[a-f\d]{24}$/i, [
        ["pid", pid],
      ]);

      const product = await productDAO.getById(pid);
      if (product.status === "error")
        CustomError.createCustomError(EErrors.NOT_FOUND, {
          method: "getProductById",
          message: pid,
        });

      return product;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getProducts = async (limit = 10, page = 1, sort = 0, queries) => {
    try {
      const products = await productDAO.getAll();
      if (products.status === "error")
        CustomError.createCustomError(EErrors.NOT_FOUND, {
          method: "getProducts",
          message: "every product",
        });

      ParamValidation.validatePattern(
        "getProducts",
        /^(?!0)\d+$/,
        [
          ["limit", limit.toString()],
          ["page", page.toString()],
        ],
        infoError.productPagination({
          limit,
          page,
          sort,
          plength: products.payload.length,
        })
      );
      ParamValidation.validatePattern(
        "getProducts",
        /^(-1|0|1)$/,
        [["sort", sort.toString()]],
        infoError.productPagination({
          limit,
          page,
          sort,
          plength: products.payload.length,
        })
      );
      ParamValidation.validateComparison(
        "getProducts",
        page,
        "<=",
        Math.ceil(products.payload.length / limit),
        infoError.productPagination({
          limit,
          page,
          sort,
          plength: products.payload.length,
        })
      );

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
      if (paginated.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "productDAO.paginate",
          message: paginated.error,
        });

      return paginated;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  updateProduct = async (data, update) => {
    try {
      ParamValidation.isProvided("updateProduct", [
        ["data", data],
        ["update", update],
      ]);

      for (const key in update) {
        switch (key) {
          case "title":
            ParamValidation.validatePattern(
              "updateProduct",
              /^[a-zñáéíóúü0-9-+/#,.$&()\s]+$/i,
              [["title", update[key]]]
            );
            break;
          case "price":
            ParamValidation.validatePattern("updateProduct", /^(?!0)\d+$/, [
              ["price", update[key]],
            ]);
            break;
          case "stock":
            ParamValidation.validatePattern("updateProduct", /^(?!0)\d+$/, [
              ["stock", update[key]],
            ]);
            break;
          case "code":
            ParamValidation.validatePattern("updateProduct", /^\d{5}$/, [
              ["code", update[key]],
            ]);
            break;
          case "category":
            ParamValidation.validatePattern(
              "updateProduct",
              /^(Anime|Paisajes|Sci-Fi|Abstracto|Retratos)$/,
              [["category", update[key]]]
            );
            break;
          case "description":
            break;
          case "thumnbnails":
            break;
          default:
            if (!key.startsWith("$"))
              CustomError.createCustomError(EErrors.INVALID_PARAM, {
                method: "updateProduct",
                message: `Cannot update inexistent property "${key}"`,
              });
            break;
        }
      }

      const result = await productDAO.update(data, update);
      if (result.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "productDAO.update",
          message: result.error,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  deleteProduct = async (data) => {
    try {
      ParamValidation.isProvided("deleteProduct", [["data", data]]);

      const result = await productDAO.delete(data);
      if (result.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "productDAO.delete",
          message: result.error,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };
}

module.exports = ProductService;
