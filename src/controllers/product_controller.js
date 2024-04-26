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
      let limit = req.query.limit,
        page = req.query.page,
        sort = req.query.sort,
        queries = req.query;

      const queryProducts = await productService.getProducts(
        limit,
        page,
        sort,
        queries
      );

      if (queryProducts.status) {
        return res.sendSuccess(queryProducts.payload);
      } else {
        return res.sendUserError(queryProducts.error);
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
