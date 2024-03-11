const express = require("express"),
  userManager = require("../dao/db/managers/user_manager.js");

const routerSessions = express.Router();

//Sube los datos del usuario a la db
routerSessions.post("/register", async (req, res) => {
  const user = await userManager.saveUser(req.body);

  if (user) {
    res.redirect("http://localhost:8080/login");
  }
});

// Maneja el login y permite el acceso al perfil
routerSessions.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userManager.getUser(email, password);

  if (user) {
    req.session.user = req.body;
    res.redirect("http://localhost:8080/profile");
  } else {
    res.send("Error de autenticación, email o contraseña incorrectos");
  }
});

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
