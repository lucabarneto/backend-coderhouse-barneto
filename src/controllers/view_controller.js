const ProductService = require("../services/product_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

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
}

module.exports = ViewController;
