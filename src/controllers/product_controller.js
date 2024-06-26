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

      if (product.status === "success") {
        if (req.user.role !== "admin") {
          if (product.payload.owner.toString() === req.user._id.toString()) {
            req.product = product.payload;
            next();
          } else {
            CustomError.createCustomError(EErrors.FORBIDDEN, {
              message: infoError.notAuthorized("handlePid"),
            });
          }
        } else {
          req.product = product.payload;
          next();
        }
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  getProducts = async (req, res) => {
    try {
      let limit = req.query.limit,
        page = req.query.page,
        sort = req.query.sort,
        queries = req.query;

      const products = await productService.getProducts(
        limit,
        page,
        sort,
        queries
      );

      if (products.status === "success") {
        return res.sendSuccess(products.payload);
      } else {
        throw products.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  getProductById = async (req, res) => {
    return req.product;
  };

  addProduct = async (req, res) => {
    try {
      const product = await productService.addProduct(req.body);

      if (product.status === "success") {
        return res.sendCreatedSuccess(product.payload);
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const product = await productService.updateProduct(req.product, req.body);

      if (product.status === "success") {
        return res.sendCreatedSuccess(product.payload);
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const product = await productService.deleteProduct(req.product);

      if (product.status === "success") {
        return res.sendSuccess(product.payload);
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  createMockProducts = (req, res) => {
    let products = faker.generateMockProducts(100);
    return res.sendSuccess(products);
  };
}

module.exports = productController;
