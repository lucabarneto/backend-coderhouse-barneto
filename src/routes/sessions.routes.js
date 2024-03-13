const express = require("express"),
  jwt = require("../utils/jwt.js");
passport = require("passport");

const routerSessions = express.Router();

//
routerSessions.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.redirect("http://localhost:8080/login");
  }
);

// Maneja el login y permite el acceso al perfil
routerSessions.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    console.log(req.user);
    const ACCESS_TOKEN = jwt.generateToken(req.user);
    console.log(ACCESS_TOKEN);

    res.redirect("http://localhost:8080/profile");
  }
);

// Destruye la session y devuelve al usuario al login
routerSessions.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send(`Error al salir de sesión: ${err}`);
    }

    res.redirect("http://localhost:8080/login");
  });
});

module.exports = routerSessions;
