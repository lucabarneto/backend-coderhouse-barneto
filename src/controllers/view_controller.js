const ProductService = require("../services/product_service.js"),
  CartService = require("../services/cart_service.js"),
  TicketService = require("../services/ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js");

const productService = new ProductService(),
  cartService = new CartService(),
  ticketService = new TicketService();

class ViewController {
  renderProducts = async (req, res) => {
    try {
      const products = await productService.getProducts();

      if (products.status) {
        return res.render("home", {
          products: products.payload.docs,
          profile: req.user,
        });
      } else {
        throw products.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  renderProductsRT = async (req, res) => {
    try {
      const products = await productService.getProducts();

      if (products.status) {
        return res.render("realTimeProducts", {
          products: products.payload.docs,
        });
      } else {
        throw products.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  renderChat = (req, res) => {
    res.render("chat");
  };

  renderRegister = (req, res) => {
    res.render("register");
  };

  renderRegisterFail = (req, res) => {
    try {
      return res.sendUserError("Failed to register user");
    } catch (err) {
      return res.sendServerError(err.message);
    }
  };

  renderLogin = (req, res) => {
    res.render("login");
  };

  renderLoginFail = (req, res) => {
    try {
      return res.sendUserError("Failed to log in: incorrect user or password");
    } catch (err) {
      return res.sendServerError(err.message);
    }
  };

  renderProfile = (req, res) => {
    res.render("profile", req.user);
  };

  renderProduct = async (req, res) => {
    try {
      let pid = req.params.id;
      const product = await productService.getProductById(pid);

      if (product.status) {
        return res.render("product", {
          product: product.payload,
          profile: req.user,
        });
      } else {
        throw product.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  renderCart = async (req, res) => {
    try {
      let cid = req.params.id;
      const cart = await cartService.getCartById(cid);

      if (cart.status) {
        return res.render("cart", {
          cart: cart.payload,
          profile: req.user,
        });
      } else {
        throw cart.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  renderTicket = async (req, res) => {
    try {
      let tid = req.params.id;

      const ticket = await ticketService.getTicketById(tid);

      if (ticket.status) {
        return res.sendSuccess(ticket.payload);
      } else {
        throw ticket.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = ViewController;
