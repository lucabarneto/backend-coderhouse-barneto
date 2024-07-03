const ProductService = require("../services/product_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  ParamValidation = require("../utils/validations.js"),
  faker = require("../utils/faker.js");

const productService = new ProductService();

class productController {
  //handlePid se emplea sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    try {
      const product = await productService.getProductById(pid);

      if (product.status === "success") {
        req.logger.http(
          `The given pid (${pid}) was found inside the database - ${new Date().toLocaleString()}`
        );
        req.product = product.payload;
        next();
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
      let thumbnails = [];

      req.files.forEach((file) => {
        thumbnails.push(`/uploads/thumbnails/${file.filename}`);
      });

      const productData = {
        ...req.body,
        thumbnails,
      };

      const product = await productService.addProduct(productData);

      if (product.status === "success") {
        req.logger.http(
          `Product added to database successfully - ${new Date().toLocaleString()}`
        );
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
      ParamValidation.validateAuthorization(
        "updateProduct",
        req.product.owner,
        req.user._id
      );

      const product = await productService.updateProduct(req.product, req.body);

      if (product.status === "success") {
        req.logger.http(
          `Product updated successfully - ${new Date().toLocaleString()}`
        );
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
      ParamValidation.validateAuthorization(
        "deleteProduct",
        req.product.owner,
        req.user._id
      );

      const product = await productService.deleteProduct(req.product);

      if (product.status === "success") {
        req.logger.http(
          `Product deleted successfully - ${new Date().toLocaleString()}`
        );
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
