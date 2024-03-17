const express = require("express"),
  jwt = require("../utils/jwt.js"),
  passport = require("passport");

const routerSessions = express.Router();

//Registra un usuario en la db
routerSessions.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/failregister",
  }),
  (req, res) => {
    res.redirect("http://localhost:8080/login");
  }
);

routerSessions.get("/failregister", (req, res) => {
  res.status(400).send("Failed to register user");
});

// Maneja el login y permite el acceso al perfil
routerSessions.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "api/sessions/faillogin" }),
  (req, res) => {
    const ACCESS_TOKEN = jwt.generateToken(req.user);

    res.status(200).send({ status: true, payload: ACCESS_TOKEN, error: null });
  }
);

routerSessions.get("/faillogin", (req, res) => {
  res.send("Failed to log in: incorrect user or password");
});

routerSessions.get(
  "/github",
  passport.authenticate("github", {}),
  (req, res) => {}
);

routerSessions.get(
  "/githubcallback",
  passport.authenticate("github", {}),
  (req, res) => {
    const ACCESS_TOKEN = jwt.generateToken(req.user);

    res.status(200).send({
      status: true,
      payload: ACCESS_TOKEN,
      error: null,
    });
  }
);

module.exports = routerSessions;
