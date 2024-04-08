const ProductService = require("../dao/db/services/product_service.js");

const productService = new ProductService();

class ViewController {
  renderProducts = async (req, res) => {
    try {
      const products = await productService.getProducts();

      if (products.status) {
        console.log(products.payload.docs);
        return res.render("home", {
          products: products.payload.docs,
        });
      } else {
        return res.sendUserError(products.error);
      }
    } catch (err) {
      console.error(err);
      return res.sendServerError(err);
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
        return res.sendUserError(products.error);
      }
    } catch (err) {
      console.error(err);
      return res.sendServerError(err);
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
}

module.exports = ViewController;
