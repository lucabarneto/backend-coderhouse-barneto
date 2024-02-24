//Importo las dependencias
const express = require("express"),
  cm = require("../dao/db/cart_manager.js");

//Guardo las dependencias en constantes
const routerCarts = express.Router();

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) => {
  try {
    await cm.addCart(req.body);
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
    const cart = await cm.getCartProducts(cid);
    res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(404).send("Cart not found");
  }
});

//Añade un producto al carrito
routerCarts.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid,
      pid = req.params.pid;

    await cm.addProductToCart(cid, pid);

    res.status(201).send("Product added to cart successfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("Cart or product not found");
  }
});

//Exporto routerCarts
module.exports = routerCarts;
