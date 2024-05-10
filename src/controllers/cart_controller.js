const CartService = require("../services/cart_service.js"),
  ProductService = require("../services/product_service.js"),
  TicketService = require("../services/ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js");

const cartService = new CartService(),
  productService = new ProductService(),
  ticketService = new TicketService();

class CartController {
  //handlePid y handleCid se emplean sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid y handleCid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    try {
      const product = await productService.getProductById(pid);

      if (product.status) {
        req.product = product.payload;
        next();
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  handleCid = async (req, res, next, cid) => {
    try {
      const cart = await cartService.getCartById(cid);

      if (cart.status) {
        req.cart = cart.payload;
        next();
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = await cartService.addCart(req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  getProducts = async (req, res) => {
    return req.cart.products;
  };

  addProductToCart = async (req, res) => {
    try {
      let quantity = req.body.quantity;

      const cart = await cartService.addProductToCart(
        req.cart,
        req.product,
        quantity
      );

      if (cart.status === true) {
        return res.sendCreatedSuccess(cart.payload);
      } else if (cart.status === false) {
        throw cart.error;
      } else if (cart.status === "error") {
        return res.send({ status: "error" });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  deleteAllProducts = async (req, res) => {
    try {
      const cart = await cartService.deleteAllProducts(req.cart);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const cart = await cartService.deleteProduct(req.cart, req.product);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  updateProduct = async (req, res) => {
    try {
      let quantity = req.body.quantity,
        state = req.body.state;

      const cart = await cartService.updateProduct(
        req.cart,
        req.product,
        quantity,
        state
      );

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  InsertProducts = async (req, res) => {
    try {
      const cart = await cartService.updateCart(req.cart, req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  purchaseProducts = async (req, res) => {
    try {
      const ticket = await cartService.purchaseProducts(req.cart, req.user);

      if (ticket.status) {
        return res.sendSuccess(ticket.payload);
      } else {
        throw ticket.error;
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };
}

module.exports = CartController;
