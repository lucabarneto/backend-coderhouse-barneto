//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/managers/product_manager.js"),
  auth = require("../middlewares/auth.js");

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

//Renderiza la sección del chat
routerViews.get("/chat", auth, (req, res) => {
  res.render("chat");
});

//Renderiza el login
routerViews.get("/login", (req, res) => {
  res.render("login");
});

//Renderiza el registro
routerViews.get("/register", (req, res) => {
  res.render("register");
});

//Renderiza la sección del perfil del usuario
routerViews.get("/profile", auth, (req, res) => {
  console.log(req.user);
  res.render("profile", req.user);
});

// exporto routerViews
module.exports = routerViews;
