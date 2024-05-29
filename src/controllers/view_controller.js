const ProductService = require("../services/product_service.js"),
  CartService = require("../services/cart_service.js"),
  UserService = require("../services/user_service.js"),
  TicketService = require("../services/ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js");

const productService = new ProductService(),
  cartService = new CartService(),
  ticketService = new TicketService(),
  userService = new UserService();

class ViewController {
  renderProducts = async (req, res) => {
    try {
      const products = await productService.getProducts();

      const productsToJSON = JSON.stringify(products);
      if (products.status) {
        return res.render("home", {
          products: JSON.parse(productsToJSON).payload.docs,
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

      const productsToJSON = JSON.stringify(products);
      if (products.status) {
        return res.render("realTimeProducts", {
          products: JSON.parse(productsToJSON).payload.docs,
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
          product: product.payload.toJSON(),
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
          cart: cart.payload.toJSON(),
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

  renderControl = async (req, res) => {
    const products = await productService.getProducts();

    const userProducts = JSON.stringify(
      products.payload.docs.filter((pr) => pr.owner === req.user._id)
    );

    return res.render("control", {
      profile: req.user,
      products: JSON.parse(userProducts),
    });
  };
}

module.exports = ViewController;
