const CartService = require("../services/cart_service.js"),
  ProductService = require("../services/product_service.js"),
  TicketService = require("../services/ticket.service.js");

const cartService = new CartService(),
  productService = new ProductService(),
  ticketService = new TicketService();

class CartController {
  //handlePid y handleCid se emplean sobre el método param del router. Muchas funciones necesitan de una ejecución previa de handlePid y handleCid para funcionar correctamente
  handlePid = async (req, res, next, pid) => {
    const product = await productService.getProductById(pid);

    if (!product.status) {
      req.product = null;
    } else {
      req.product = product.payload;
    }

    next();
  };

  handleCid = async (req, res, next, cid) => {
    const cart = await cartService.getCartById(cid);

    if (!cart.status) {
      req.cart = null;
    } else {
      req.cart = cart.payload;
    }

    next();
  };

  createCart = async (req, res) => {
    try {
      const cart = await cartService.addCart(req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  getProducts = async (req, res) => {
    try {
      return req.cart
        ? res.sendSuccess(req.cart.products)
        : res.sendNotFoundError("Cart not found");
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  addProductToCart = async (req, res) => {
    try {
      let quantity = req.body.quantity;

      if (!req.cart) {
        return res.sendNotFoundError("Cart not found");
      }
      if (!req.product) {
        return res.sendNotFoundError("Product not found");
      }
      if (typeof quantity !== "number")
        return res.sendUserError("Product's quantity must be a number");
      if (quantity <= 0)
        return res.sendUserError(
          "Product's quantity must not be neither 0 nor a negative number"
        );

      //Verifico que la cantidad agregada no sobrepase el stock del producto
      if (quantity > req.product.stock)
        return res.sendUserError(
          `Product's quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${req.product.stock}`
        );

      const cart = await cartService.addProductToCart(
        req.cart,
        req.product,
        quantity
      );

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  deleteAllProducts = async (req, res) => {
    try {
      if (!req.cart) {
        return res.sendNotFoundError("Cart not found");
      }

      const cart = await cartService.deleteAllProducts(req.cart);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      if (!req.cart) {
        return res.sendNotFoundError("Cart not found");
      }
      if (!req.product) {
        return res.sendNotFoundError("Product not found");
      }

      const cart = await cartService.deleteProduct(req.cart, req.product);

      if (cart.status) {
        return res.sendSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  updateProduct = async (req, res) => {
    try {
      let quantity = req.body.quantity || undefined;

      if (!req.cart) {
        return res.sendNotFoundError("Cart not found");
      }
      if (!req.product) {
        return res.sendNotFoundError("Product not found");
      }
      if (quantity === undefined) {
        return res.sendUserError("No new quantity provided");
      }
      if (typeof quantity !== "number") {
        return res.sendUserError("Product's quantity must be a number");
      }
      if (quantity <= 0)
        return res.sendUserError(
          "Product's quantity must not be neither 0 nor a negative number"
        );
      if (quantity > req.product.stock)
        return res.sendUserError(
          `Product's new quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      const cart = await cartService.updateProductQuantity(
        req.cart,
        req.product,
        quantity
      );

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  InsertProducts = async (req, res) => {
    try {
      if (!req.cart) {
        return res.sendServerError("Cart not provided");
      }
      if (!req.body) {
        return res.sendServerError("No body provided");
      }
      if (!(req.body instanceof Array)) {
        return res.sendServerError("Body must be an array");
      }
      for (const object of req.body) {
        for (const key in object) {
          if (key !== "product" && key !== "quantity")
            return res.sendUserError(
              "Products passed inside the array must follow the pattern: {product: 'id', quantity: number}"
            );
        }
      }

      const cart = await cartService.updateCart(req.cart, req.body);

      if (cart.status) {
        return res.sendCreatedSuccess(cart.payload);
      } else {
        return res.sendUserError(cart.error);
      }
    } catch (err) {
      return res.sendServerError(err.message ? err.message : err);
    }
  };

  purchase = async (req, res) => {
    const cart = await cartService.getCart(req.cart);

    let amount = 0,
      unprocessed = [];

    cart.payload.products.forEach(async (pref) => {
      const product = await productService.getProductById(pref.product._id);

      if (product.stock >= pref.quantity) {
        amount += product.price * pref.quantity;

        await productService.updateProduct(product, {
          $set: { stock: stock - pref.quantity },
        });
      } else {
        unprocessed.push(pref);
      }
    });

    if (amount === 0) {
      return res.sendServerError("No products were processed");
    }

    let code = Math.round(Math.random() * 10000).toString();

    const ticketData = {
      code,
      purchase_datetime: Date.now(),
      amount,
      purchaser: req.user.email,
    };

    const ticket = await ticketService.createTicket(ticketData);

    await cartService.deleteAllProducts(cart);
    await cartService.updateCart(cart, unprocessed);

    return res.sendSuccess(ticket);
  };
}

module.exports = CartController;
