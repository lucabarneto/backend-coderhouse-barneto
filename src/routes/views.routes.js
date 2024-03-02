//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/managers/product_manager.js");

//Guardo las dependencias en constantes
const routerViews = express.Router();

const auth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.redirect("http://localhost:8080/login");
};

routerViews.get("/", auth, async (req, res) => {
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

routerViews.get("/realtimeproducts", auth, async (req, res) => {
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
  const userInfo = {
    firstName: req.session.firstName,
    lastName: req.session.lastName,
    age: req.session.age,
    admin: req.session.admin,
  };

  res.render("profile", userInfo);
});

// exporto routerViews
module.exports = routerViews;
