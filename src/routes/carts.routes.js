//Importo las dependencias
const express = require("express"),
  cartManager = require("../cart_manager.js");

//Guardo las dependencias en constantes
const routerCarts = express.Router(),
  cm = new cartManager();

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) => {
  const cart = await cm.addCart();

  res.status(201).send(cart);
});

//Muestra los productos del carrito
routerCarts.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  const products = await cm.getCartsProducts(Number(cid));

  if (!products) {
    res.status(404).send("Carrito no encontrado");
  }

  res.status(200).send(products);
});

//Añade un producto al carrito
routerCarts.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid,
    pid = req.params.pid;

  const updatedCart = await cm.addProductToCart(Number(cid), Number(pid));

  if (updatedCart) {
    res.status(201).send("Producto agregado al carrito exitósamente");
  } else {
    res.status(404).send("Carrito o producto no encontrados");
  }
});

//Exporto routerCarts
module.exports = routerCarts;
