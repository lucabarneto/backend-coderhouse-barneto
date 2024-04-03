//Importo las dependencias
const Router = require("./custom_router.js"),
  CartManager = require("../dao/db/managers/cart_manager.js"),
  ProductManager = require("../dao/db/managers/product_manager.js");

//Guardo las dependencias en constantes
const cartManager = new CartManager(),
  productManager = new ProductManager();

class CartRouter extends Router {
  init() {
    //Manipulo el cid pasado como parámetro
    this.router.param("cid", async (req, res, next, cid) => {
      const cart = await cartManager.getCartById(cid);

      if (!cart.status) {
        req.cart = null;
      } else {
        req.cart = cart.payload;
        req.cid = cid;
      }

      next();
    });

    //Manipulo el pid pasado como parámetro
    this.router.param("pid", async (req, res, next, pid) => {
      const product = await productManager.getProductById(pid);

      if (!product.status) {
        req.product = null;
      } else {
        req.product = product.payload;
      }

      next();
    });

    //Crea un nuevo carrito
    this.post("/", ["PUBLIC"], async (req, res) => {
      try {
        const cart = await cartManager.addCart(req.body);

        if (cart.status) {
          return res.sendCreatedSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Muestra los productos del carrito
    this.get("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        return req.cart
          ? res.sendSuccess(req.cart.products)
          : res.sendNotFoundError("Cart not found");
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Añade un producto al carrito
    this.post("/:cid/products/:pid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.cart) {
          return res.sendNotFoundError("Cart not found");
        }

        if (!req.product) {
          return res.sendNotFoundError("Product not found");
        }

        const cart = await cartManager.addProductToCart(
          req.cart,
          req.product,
          req.body.quantity
        );

        if (cart.status) {
          return res.sendCreatedSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Elimina todos los productos del carrito
    this.delete("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.cart) {
          return res.sendNotFoundError("Cart not found");
        }

        const cart = await cartManager.deleteAllProducts(req.cart);

        if (cart.status) {
          return res.sendSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Elimina un producto del carrito
    this.delete("/:cid/products/:pid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.cart) {
          return res.sendNotFoundError("Cart not found");
        }

        if (!req.product) {
          return res.sendNotFoundError("Product not found");
        }

        const cart = await cartManager.deleteProduct(req.cart, req.product);

        if (cart.status) {
          return res.sendSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Actualiza la cantidad de un producto del carro
    this.put("/:cid/products/:pid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.cart) {
          return res.sendNotFoundError("Cart not found");
        }

        if (!req.product) {
          return res.sendNotFoundError("Product not found");
        }

        const cart = await cartManager.updateProductQuantity(
          req.cart,
          req.product,
          req.body.quantity
        );

        if (cart.status) {
          return res.sendCreatedSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });

    //Agrega un array de productos al carro
    this.put("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        const cart = await cartManager.updateCart(req.cart, req.body);

        if (cart.status) {
          return res.sendCreatedSuccess(cart.payload);
        } else {
          return res.sendUserError(cart.error);
        }
      } catch (err) {
        return res.sendServerError(err.message ? err.message : err);
      }
    });
  }
}

module.exports = CartRouter;
