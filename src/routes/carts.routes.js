//Importo las dependencias
const express = require("express"),
  cartManager = require("../dao/db/managers/cart_manager.js");

//Guardo las dependencias en constantes
const routerCarts = express.Router();

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) => {
  try {
    await cartManager.addCart(req.body);
    res.status(201).send("Cart created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("An error has occurred");
  }
});

//Muestra los productos del carrito
routerCarts.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartProducts(cid);
    res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(404).send("Cart not found");
  }
});

//Añade un producto al carrito
routerCarts.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid,
      pid = req.params.pid,
      quantity = req.body.quantity || 1;

    const cart = await cartManager.addProductToCart(cid, pid, quantity);

    console.log(JSON.stringify(cart, null, 2));

    res
      .status(201)
      .send(
        `Product added to cart successfully: ${JSON.stringify(cart, 2, null)}`
      );
  } catch (err) {
    console.log(err);
    res.status(404).send("Cart or product not found");
  }
});

routerCarts.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartManager.deleteAllProducts(cid);

    res.status(200).send(`Productos eliminados correctamente: ${cart}`);
  } catch (err) {
    console.log(err);
  }
});

routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid,
      pid = req.params.pid;

    const cart = await cartManager.deleteProduct(cid, pid);

    res.status(200).send(`Producto eliminado correctamente: ${cart}`);
  } catch (err) {
    console.log(err);
  }
});

routerCarts.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid,
      pid = req.params.pid,
      quantity = req.body.quantity;

    await cartManager.updateProductQuantity(cid, pid, quantity);

    res.send("Producto actualizado correctamente");
  } catch (err) {
    console.log(err);
  }
});

routerCarts.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid,
      products = req.body;

    const cart = await cartManager.updateCart(cid, products);

    console.log(cart);

    res.status(200).send(`Productos agregados al carrito: ${cart}`);
  } catch (err) {
    console.log(err);
  }
});

//Exporto routerCarts
module.exports = routerCarts;
