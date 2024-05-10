const CartDAO = require("../dao/mongo/cart.mongo"),
  ProductService = require("./product_service.js"),
  TicketService = require("./ticket.service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const cartDAO = new CartDAO(),
  productService = new ProductService(),
  ticketService = new TicketService();

class CartService {
  constructor() {}

  //Obtiene un cart
  getCartById = async (cid) => {
    try {
      if (!cid) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Cart", "getCartById", [
            cid,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const cart = await cartDAO.getById(cid);

      if (cart.status) {
        return cart;
      } else {
        CustomError.createCustomError({
          name: "Incorrect ID Error",
          cause: infoError.notFoundIDErrorInfo(cid, "carts"),
          message: "There was an error while searching for the given id",
          code: EErrors.INVALID_ID_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Añade un cart
  addCart = async (data = {}) => {
    try {
      const cart = await cartDAO.create(data);

      if (cart.status) {
        return cart;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addCart", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Añade un producto a un cart
  addProductToCart = async (data, product, quantity) => {
    try {
      if (!data || !product) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Cart",
            "addProductToCart",
            [data && product]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      if (
        !quantity ||
        typeof quantity !== "number" ||
        quantity <= 0 ||
        quantity > product.stock
      ) {
        CustomError.createCustomError({
          name: "Invalid quantity error",
          cause: infoError.productQuantityErrorInfo(quantity, product.stock),
          message: "There was an error in the product's quantity provided",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      let checkExistingProduct = data.products.some(
        (pr) => pr.product._id.toString() == product._id.toString()
      );

      // Envío un "error" para que el cliente haga un fetch con método PUT
      if (checkExistingProduct) {
        return { status: "error" };
      }

      const cart = await cartDAO.get(data);

      if (!cart.status) {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addProductToCart", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }

      cart.payload.products.push({
        product: product._id,
        quantity,
      });

      const update = await cartDAO.update(data, cart.payload);

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addProductToCart", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Elimina todos los productos del cart
  deleteAllProducts = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Cart",
            "deleteAllProducts",
            [data]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const update = await cartDAO.update(data, {
        $set: { products: [] },
      });

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteAllProducts", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Elimina un producto de cart
  deleteProduct = async (data, product) => {
    try {
      if (!data || !product) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Cart", "deleteProduct", [
            data && product,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const update = await cartDAO.update(data, {
        $pull: { products: { product: product._id } },
      });

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("deleteProduct", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Actualiza un producto
  updateProduct = async (data, product, quantity, state) => {
    try {
      if (!data || !product) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Cart", "updateProduct", [
            data && product,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      if (
        !quantity ||
        typeof quantity !== "number" ||
        quantity <= 0 ||
        quantity > product.stock
      ) {
        CustomError.createCustomError({
          name: "Invalid quantity error",
          cause: infoError.productQuantityErrorInfo(quantity, product.stock),
          message: "There was an error in the product's quantity provided",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const cart = await cartDAO.get(data);

      if (!cart.status) {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateProduct", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }

      //Aumento la cantidad del producto con el pid específico
      const productToUpdate = cart.payload.products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      if (state === "add") {
        productToUpdate.quantity += quantity;
      } else if (state === "edit") {
        productToUpdate.quantity = quantity;
      }

      const update = await cartDAO.update(data, cart.payload);

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateProduct", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  //Actualiza el carrito
  updateCart = async (data, arr) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Cart", "updateCart", [
            data,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      if (!(arr instanceof Array)) {
        CustomError.createCustomError({
          name: "Products to insert Error",
          cause: infoError.productsInsertedErrorInfo(),
          message: "There was an error in the product's array",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }
      for (const object of arr) {
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

      const update = await cartDAO.update(data, {
        $addToSet: { products: { $each: arr } },
      });

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("insertProducts", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  purchaseProducts = async (data, user) => {
    try {
      if (!data || !user) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Cart", "getCartById", [
            data && user,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const cart = await cartDAO.get(data),
        products = await productService.getProducts();

      if (!cart.status) {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("purchaseProducts", cart.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }

      if (!products.status) throw products.error;

      let amount = 0,
        unprocessed = [];

      cart.payload.products.forEach(async (pref) => {
        const product = products.payload.docs.find(
          (p) => pref.product._id.toString() === p._id.toString()
        );

        if (product.stock >= pref.quantity) {
          amount += product.price * pref.quantity;

          const update = await productService.updateProduct(product, {
            $set: { stock: product.stock - pref.quantity },
          });

          if (!update.status) throw update.error;
        } else {
          console.log("PRODUCTO NO PROCESADO");
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
        purchaser: user.email,
      };

      const deleted = await this.deleteAllProducts(cart.payload);

      if (!deleted.status) throw deleted.error;

      const updated = await this.updateCart(
        { _id: cart.payload._id },
        unprocessed
      );

      if (!updated.status) throw updated.error;

      const ticket = await ticketService.createTicket(ticketData);

      if (ticket.status) {
        return ticket;
      } else {
        throw ticket.error;
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };
}

module.exports = CartService;
