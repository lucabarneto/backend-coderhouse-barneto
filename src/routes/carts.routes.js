//Importo las dependencias
const express = require("express"),
  productModel = require("../dao/db/models/product.model.js"),
  cartModel = require("../dao/db/models/cart.model.js");

//Guardo las dependencias en constantes
const routerCarts = express.Router();

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) => {
  try {
    await cartModel.create(req.body);
    res.status(201).send("Cart created succesfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred");
  }
});

//Muestra los productos del carrito
routerCarts.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.find({ _id: cid }, { products: 1 });
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
    const product = await productModel.findById(pid);

    await cartModel.updateOne(
      { _id: cid },
      { $addToSet: { products: product } }
    );

    res.status(201).send("Producto agregado al carrito exitósamente");
  } catch (err) {
    console.log(err);
    res.status(404).send("Cart or product not found");
  }
});

//Exporto routerCarts
module.exports = routerCarts;
