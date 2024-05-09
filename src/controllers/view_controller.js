const ProductService = require("../services/product_service.js"),
  CartService = require("../services/cart_service.js"),
  TicketService = require("../services/ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const productService = new ProductService(),
  cartService = new CartService(),
  ticketService = new TicketService();

class ViewController {
  renderProducts = async (req, res) => {
    try {
      const products = await productService.getProducts();

      if (products.status) {
        return res.render("home", {
          products: products.payload,
          profile: req.user,
        });
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("renderProducts", products.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
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
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo(
            "renderProductsRT",
            products.error
          ),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
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
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(pid, "products"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
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
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(cid, "carts"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  renderTicket = async (req, res) => {
    try {
      let tid = req.params.id;

      const ticket = await ticketService.getTicketById(tid);

      if (ticket.status) {
        return res.sendSuccess(ticket.payload);
      } else {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(tid, "tickets"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };
}

module.exports = ViewController;
