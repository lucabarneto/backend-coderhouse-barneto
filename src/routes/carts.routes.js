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
        return res.sendServerError(err);
      }
    });

    //Muestra los productos del carrito
    this.get("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        return req.cart
          ? res.sendSuccess(req.cart.products)
          : res.sendNotFoundError("Cart not found");
      } catch (err) {
        return res.sendServerError(err);
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
        return res.sendServerError(err);
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
        return res.sendServerError(err);
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
        return res.sendServerError(err);
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
        return res.sendServerError(err);
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
        return res.sendServerError(err);
      }
    });
  }
}

module.exports = CartRouter;

//Crea un nuevo carrito
// routerCarts.post("/", async (req, res) => {
//   try {
//     const cart = await cartManager.addCart(req.body);

//     if (cart.status) {
//       res.status(201).send("Cart created successfully");
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Muestra los productos del carrito
// routerCarts.get("/:cid", async (req, res) => {
//   try {
//     let cid = req.params.cid;
//     const cart = await cartManager.getCartProducts(cid);

//     if (cart.status) {
//       res.status(200).send(cart.payload);
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

//Añade un producto al carrito
// routerCarts.post("/:cid/products/:pid", async (req, res) => {
//   try {
//     let cid = req.params.cid,
//       pid = req.params.pid,
//       quantity = req.body.quantity;
//     const cart = await cartManager.addProductToCart(cid, pid, quantity);

//     if (cart.status) {
//       res
//         .status(201)
//         .send(
//           `Product added to cart successfully: ${JSON.stringify(
//             cart.payload,
//             2,
//             null
//           )}`
//         );
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Elimina todos los productos del carrito
// routerCarts.delete("/:cid", async (req, res) => {
//   try {
//     let cid = req.params.cid;
//     const cart = await cartManager.deleteAllProducts(cid);

//     if (cart.status) {
//       res.status(200).send("Products deleted successfully");
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Elimina un producto del carrito
// routerCarts.delete("/:cid/products/:pid", async (req, res) => {
//   try {
//     let cid = req.params.cid,
//       pid = req.params.pid;
//     const cart = await cartManager.deleteProduct(cid, pid);

//     if (cart.status) {
//       res.status(200).send("Product deleted succesfully");
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

//Actualiza la cantidad de un producto del carro
// routerCarts.put("/:cid/products/:pid", async (req, res) => {
//   try {
//     let cid = req.params.cid,
//       pid = req.params.pid,
//       quantity = req.body.quantity;

//     const cart = await cartManager.updateProductQuantity(cid, pid, quantity);

//     if (cart.status) {
//       res.status(201).send("Product updated successfully");
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Agrega un array de productos al carro
// routerCarts.put("/:cid", async (req, res) => {
//   try {
//     let cid = req.params.cid,
//       products = req.body;
//     const cart = await cartManager.updateCart(cid, products);

//     if (cart.status) {
//       res.status(201).send("Products added to cart successfully");
//     } else {
//       throw new Error(cart.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Exporto routerCarts
// module.exports = routerCarts;
