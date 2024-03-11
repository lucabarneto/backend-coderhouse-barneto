//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/managers/product_manager.js");

//Guardo las dependencias en constantes
const routerViews = express.Router();

//Middleware de autenticación para acceder a las vistas
const auth = (req, res, next) =>
  req.session.user ? next() : res.redirect("http://localhost:8080/login");

//Middleware para evitar volver a loggearse si ya se está loggeado
const logged = (req, res, next) =>
  req.session.user ? res.redirect("http://localhost:8080/profile") : next();

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
routerViews.get("/login", logged, (req, res) => {
  res.render("login");
});

//Renderiza el registro
routerViews.get("/register", logged, (req, res) => {
  res.render("register");
});

//Renderiza la sección del perfil del usuario
routerViews.get("/profile", auth, (req, res) => {
  let role = "user";

  //Manejo del rol del usuario
  if (
    req.session.user.email === "adminCoder@coder.com" &&
    req.session.user.password === "adminCod3r123"
  ) {
    role = "admin";
  }

  const userInfo = {
    email: req.session.user.email,
    role,
  };

  res.render("profile", userInfo);
});

// exporto routerViews
module.exports = routerViews;
