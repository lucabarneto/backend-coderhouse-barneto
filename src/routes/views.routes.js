//Importo las dependencias
const express = require("express"),
  productManager = require("../product_manager.js");

//Guardo las dependencias en constantes
const routerViews = express.Router(),
  pm = new productManager();

routerViews.get("/", async (req, res) => {
  const products = await pm.getProducts();

  res.render("home", {
    products: products,
  });
});

routerViews.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();

  res.render("realTimeProducts", {
    products: products,
  });
});

// exporto routerViews
module.exports = routerViews;
