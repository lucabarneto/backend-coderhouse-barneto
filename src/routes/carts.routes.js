//Importo las dependencias
const express = require("express"),
  CartManager = require("../dao/db/managers/cart_manager.js");

//Guardo las dependencias en constantes
const routerCarts = express.Router(),
  cartManager = new CartManager();

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) => {
  try {
    const cart = await cartManager.addCart(req.body);

    if (cart.status) {
      res.status(201).send("Cart created successfully");
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Muestra los productos del carrito
routerCarts.get("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    const cart = await cartManager.getCartProducts(cid);

    if (cart.status) {
      res.status(200).send(cart.payload);
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Añade un producto al carrito
routerCarts.post("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid,
      pid = req.params.pid,
      quantity = req.body.quantity;
    const cart = await cartManager.addProductToCart(cid, pid, quantity);

    if (cart.status) {
      res
        .status(201)
        .send(
          `Product added to cart successfully: ${JSON.stringify(
            cart.payload,
            2,
            null
          )}`
        );
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Elimina todos los productos del carrito
routerCarts.delete("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    const cart = await cartManager.deleteAllProducts(cid);

    if (cart.status) {
      res.status(200).send("Products deleted successfully");
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Elimina un producto del carrito
routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid,
      pid = req.params.pid;
    const cart = await cartManager.deleteProduct(cid, pid);

    if (cart.status) {
      res.status(200).send("Product deleted succesfully");
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Actualiza la cantidad de un producto del carro
routerCarts.put("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid,
      pid = req.params.pid,
      quantity = req.body.quantity;

    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (cart.status) {
      res.status(201).send("Product updated successfully");
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Agrega un array de productos al carro
routerCarts.put("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid,
      products = req.body;
    const cart = await cartManager.updateCart(cid, products);

    if (cart.status) {
      res.status(201).send("Products added to cart successfully");
    } else {
      throw new Error(cart.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Exporto routerCarts
module.exports = routerCarts;
