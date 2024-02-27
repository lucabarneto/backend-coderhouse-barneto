//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/managers/product_manager.js");

//Guardo las dependencias en constantes
const routerViews = express.Router();

routerViews.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render("home", {
      products: products,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Page not found");
  }
});

routerViews.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render("realTimeProducts", {
      products: products,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Page not found");
  }
});

routerViews.get("/chat", (req, res) => {
  res.render("chat");
});

// exporto routerViews
module.exports = routerViews;
