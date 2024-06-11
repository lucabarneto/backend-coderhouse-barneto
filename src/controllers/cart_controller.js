const CartService = require("../services/cart_service.js"),
  ProductService = require("../services/product_service.js"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js");

const cartService = new CartService(),
  productService = new ProductService();

class CartController {
  //handlePid y handleCid se emplean sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid y handleCid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    try {
      const product = await productService.getProductById(pid);

      if (product.status === "success") {
        req.product = product.payload;
        next();
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  handleCid = async (req, res, next, cid) => {
    try {
      const cart = await cartService.getCartById(cid);

      if (cart.status === "success") {
        req.cart = cart.payload;
        next();
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = await cartService.addCart();

      if (cart.status === "success") {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  getProducts = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "getProducts",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      return req.cart.products;
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  addProductToCart = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "addProductToCart",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      let quantity = req.body.quantity;

      const cart = await cartService.addProductToCart(
        req.cart,
        req.product,
        quantity
      );

      if (cart.status === "success") {
        return res.sendCreatedSuccess(cart.payload);
      } else if (cart.status === "error") {
        throw cart.error;
      } else if (cart.status === "update") {
        return res.send({ status: cart.status });
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  deleteAllProducts = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "deleteAllProducts",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      const cart = await cartService.deleteAllProducts(req.cart);

      if (cart.status === "success") {
        return res.sendSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "deleteProduct",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      const cart = await cartService.deleteProduct(req.cart, req.product);

      if (cart.status === "success") {
        return res.sendSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  updateProduct = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "updateProduct",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      let quantity = req.body.quantity,
        state = req.body.state;

      const cart = await cartService.updateProduct(
        req.cart,
        req.product,
        quantity,
        state
      );

      if (cart.status === "success") {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  InsertProducts = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "deleteProduct",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      const cart = await cartService.updateCart(req.cart, req.body);

      if (cart.status === "success") {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  purchaseProducts = async (req, res) => {
    try {
      if (req.user.role !== "admin")
        ParamValidation.validateAuthorization(
          "deleteProduct",
          req.user.cart._id.toString(),
          req.cart._id.toString()
        );

      const ticket = await cartService.purchaseProducts(req.cart, req.user);

      if (ticket.status === "success") {
        return res.sendSuccess(ticket.payload);
      } else {
        throw ticket.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = CartController;
