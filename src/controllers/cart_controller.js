const CartService = require("../services/cart_service.js"),
  ProductService = require("../services/product_service.js"),
  TicketService = require("../services/ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const cartService = new CartService(),
  productService = new ProductService(),
  ticketService = new TicketService();

class CartController {
  //handlePid y handleCid se emplean sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid y handleCid para funcionar correctamente
  handlePid = async function (req, res, next, pid) {
    try {
      const product = await productService.getProductById(pid);

      if (!product.status) {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(pid, "products"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      } else {
        req.product = product.payload;
      }

      next();
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  handleCid = async function (req, res, next, cid) {
    try {
      const cart = await cartService.getCartById(cid);

      if (!cart.status) {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(cid, "carts"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      } else {
        req.cart = cart.payload;
      }

      next();
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  createCart = async function (req, res) {
    try {
      const cart = await cartService.addCart(req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("createCart", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  getProducts = async function (req, res) {
    return req.cart.products;
  };

  addProductToCart = async function (req, res) {
    try {
      let quantity = req.body.quantity;

      if (
        !quantity ||
        typeof quantity !== "number" ||
        quantity <= 0 ||
        quantity > req.product.stock
      ) {
        CustomError.createCustomError({
          name: "Invalid quantity error",
          cause: infoError.productQuantityErrorInfo(
            quantity,
            req.product.stock
          ),
          message: "There was an error in the product's quantity provided",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      let checkExistingProduct = req.cart.products.some(
        (pr) => pr.product._id.toString() == req.product._id.toString()
      );

      // Envío un "error" para que el cliente haga un fetch con método PUT
      if (checkExistingProduct) {
        return res.send({ status: "error" });
      }

      const cart = await cartService.addProductToCart(
        req.cart,
        req.product,
        quantity
      );

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addProductToCart", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  deleteAllProducts = async function (req, res) {
    try {
      const cart = await cartService.deleteAllProducts(req.cart);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteAllProducts", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  deleteProduct = async function (req, res) {
    try {
      const cart = await cartService.deleteProduct(req.cart, req.product);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteProduct", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  updateProduct = async function (req, res) {
    try {
      let quantity = req.body.quantity,
        state = req.body.state;

      if (
        !quantity ||
        typeof quantity !== "number" ||
        quantity <= 0 ||
        quantity > req.product.stock
      ) {
        CustomError.createCustomError({
          name: "Invalid quantity error",
          cause: infoError.productQuantityErrorInfo(
            quantity,
            req.product.stock
          ),
          message: "There was an error in the product's quantity provided",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const cart = await cartService.updateProductQuantity(
        req.cart,
        req.product,
        quantity,
        state
      );

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateProduct", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  InsertProducts = async function (req, res) {
    try {
      if (!(req.body instanceof Array)) {
        CustomError.createCustomError({
          name: "Products to insert Error",
          cause: infoError.productsInsertedErrorInfo(),
          message: "There was an error in the product's array",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }
      for (const object of req.body) {
        for (const key in object) {
          if (key !== "product" && key !== "quantity")
            CustomError.createCustomError({
              name: "Products to insert Error",
              cause: infoError.productsInsertedErrorInfo(),
              message: "There was an error in the product's array",
              code: EErrors.INVALID_PARAM_ERROR,
            });
        }
      }

      const cart = await cartService.updateCart(req.cart, req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("insertProducts", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };

  purchase = async function (req, res) {
    try {
      const cart = await cartService.getCart(req.cart),
        products = await productService.getProducts();

      if (!cart.status || !products.status) {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo(
            "purchase",
            cart.error ? cart.error : products.error
          ),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }

      let amount = 0,
        unprocessed = [];

      cart.payload.products.forEach(async function (pref) {
        const product = products.payload.find(
          (p) => pref.product._id.toString() === p._id.toString()
        );

        if (product.stock >= pref.quantity) {
          amount += product.price * pref.quantity;

          const update = await productService.updateProduct(product, {
            $set: { stock: product.stock - pref.quantity },
          });

          if (!update.status) {
            CustomError.createCustomError({
              name: "Database error",
              cause: infoError.databaseErrorInfo(
                "insertProducts",
                update.error
              ),
              message: "There was an error trying to consult the database",
              code: EErrors.DATABASE_ERROR,
            });
          }
        } else {
          unprocessed.push(pref);
        }
      });

      if (amount === 0) {
        CustomError.createCustomError({
          name: "No products processed error",
          cause: infoError.noProductsProcessedErrorInfo(),
          message: "There was an error processing products",
          code: EErrors.DATABASE_ERROR,
        });
      }

      let code = Math.round(Math.random() * 10000).toString();

      const ticketData = {
        code,
        purchase_datetime: Date.now(),
        amount,
        purchaser: req.user.email,
      };

      await cartService.deleteAllProducts(cart.payload);

      await cartService.updateCart({ _id: cart.payload._id }, unprocessed);

      const ticket = await ticketService.createTicket(ticketData);
      return res.sendSuccess(ticket.payload);
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };
}

module.exports = CartController;
