const CartDAO = require("../dao/mongo/cart.mongo"),
  ParamValidation = require("../utils/validations.js"),
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

  addCart = async () => {
    try {
      const cart = await cartDAO.create();

      if (cart.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.create",
          message: cart.error,
        });

      return cart;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getCartById = async (cid) => {
    try {
      ParamValidation.isProvided("getCartById", [["cid", cid]]);
      ParamValidation.validatePattern("getCartById", /^[a-f\d]{24}$/i, [
        ["cid", cid],
      ]);

      const cart = await cartDAO.getById(cid);
      if (cart.status === "error")
        CustomError.createCustomError(EErrors.NOT_FOUND, {
          method: "getCartById",
          message: cid,
        });

      return cart;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  addProductToCart = async (cart, product, quantity) => {
    try {
      ParamValidation.isProvided("addProductToCart", [
        ["cart", cart],
        ["product", product],
        ["quantity", quantity],
      ]);

      ParamValidation.validatePattern(
        "addProductToCart",
        /^(?!0)\d+$/,
        [["quantity", quantity.toString()]],
        infoError.productQuantity(quantity, product.stock)
      );
      ParamValidation.validateComparison(
        "addProductToCart",
        parseInt(quantity),
        ">",
        0,
        infoError.productQuantity(quantity, product.stock)
      );
      ParamValidation.validateComparison(
        "addProductToCart",
        parseInt(quantity),
        "<=",
        product.stock,
        infoError.productQuantity(quantity, product.stock)
      );

      let checkExistingProduct = cart.products.some(
        (pr) => pr.product._id.toString() === product._id.toString()
      );
      // Envío un error "update" para que el cliente haga un fetch con método PUT
      if (checkExistingProduct) {
        return { status: "update" };
      }

      const updateCart = await cartDAO.get(cart);
      if (updateCart.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.get",
          message: updateCart.error,
        });

      updateCart.payload.products.push({
        product: product._id,
        quantity: parseInt(quantity),
      });

      const update = await cartDAO.update(cart, updateCart.payload);

      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  deleteAllProducts = async (cart) => {
    try {
      ParamValidation.isProvided("deleteAllProducts", [["cart", cart]]);

      const update = await cartDAO.update(cart, {
        $set: { products: [] },
      });
      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  deleteProduct = async (cart, product) => {
    try {
      ParamValidation.isProvided("deleteProduct", [
        ["cart", cart],
        ["product", product],
      ]);

      const update = await cartDAO.update(cart, {
        $pull: { products: { product: product._id } },
      });
      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  updateProduct = async (cart, product, quantity, state) => {
    try {
      ParamValidation.isProvided("updateProduct", [
        ["cart", cart],
        ["product", product],
        ["quantity", quantity],
      ]);

      ParamValidation.validatePattern(
        "updateProduct",
        /^(?!0)\d+$/,
        [["quantity", quantity.toString()]],
        infoError.productQuantity(quantity, product.stock)
      );
      ParamValidation.validateComparison(
        "updateProduct",
        parseInt(quantity),
        ">",
        0,
        infoError.productQuantity(quantity, product.stock)
      );
      ParamValidation.validateComparison(
        "updateProduct",
        parseInt(quantity),
        "<=",
        product.stock,
        infoError.productQuantity(quantity, product.stock)
      );

      const updateCart = await cartDAO.get(cart);
      if (updateCart.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.get",
          message: updateCart.error,
        });

      //Aumento la cantidad del producto con el pid específico
      const updateProduct = updateCart.payload.products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      if (state === "add") {
        updateProduct.quantity += quantity;
      } else if (state === "edit") {
        updateProduct.quantity = quantity;
      }

      const update = await cartDAO.update(cart, updateCart.payload);
      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  updateCart = async (cart, arr) => {
    try {
      ParamValidation.isProvided("updateCart", [["cart", cart]]);
      ParamValidation.validateDatatype(
        "updateCart",
        "array",
        arr,
        infoError.productsInserted()
      );

      for (const object of arr) {
        for (const key in object) {
          if (key !== "product" && key !== "quantity")
            CustomError.createCustomError(EErrors.INVALID_PARAM, {
              method: "updateCart",
              message: infoError.productsInserted(),
            });
        }
      }

      const update = await cartDAO.update(cart, {
        $addToSet: { products: { $each: arr } },
      });
      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  purchaseProducts = async (cart, user) => {
    try {
      ParamValidation.isProvided("purchaseProducts", [
        ["cart", cart],
        ["user", cart],
      ]);

      const userCart = await cartDAO.get(cart);
      if (userCart.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "cartDAO.get",
          message: userCart.error,
        });

      const products = await productService.getProducts();
      if (products.status === "error") throw products.error;

      let amount = 0,
        unprocessed = [];

      userCart.payload.products.forEach(async (pref) => {
        const product = products.payload.docs.find(
          (p) => pref.product._id.toString() === p._id.toString()
        );

        if (product.stock >= pref.quantity) {
          amount += product.price * pref.quantity;

          const updateProductStock = await productService.updateProduct(
            product,
            {
              $set: { stock: product.stock - pref.quantity },
            }
          );
          if (updateProductStock.status === "error")
            throw updateProductStock.error;
        } else {
          unprocessed.push(pref);
        }
      });

      ParamValidation.validateComparison(
        "purchaseProducts",
        amount,
        "!==",
        0,
        infoError.noProductsProcessed()
      );

      let code = Math.round(Math.random() * 10000 + 1000).toString();

      const ticketData = {
        code,
        purchase_datetime: Date.now(),
        amount,
        purchaser: user.email,
      };

      const deleteProducts = await this.deleteAllProducts(userCart.payload);
      if (deleteProducts.status === "error") throw deleteProducts.error;

      const updateCart = await this.updateCart(
        { _id: userCart.payload._id },
        unprocessed
      );
      if (updateCart.status === "error") throw updateCart.error;

      const ticket = await ticketService.createTicket(ticketData);
      if (ticket.status === "error") throw ticket.error;

      return ticket;
    } catch (err) {
      return { status: "error", error: err };
    }
  };
}

module.exports = CartService;
