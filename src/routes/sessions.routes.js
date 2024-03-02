const express = require("express");

const routerSessions = express.Router();

const auth = (req, res, next) => {
  if (
    req.body.email === req.session.email &&
    req.body.password === req.session.password
  ) {
    return next();
  }

  res.send("Error de autenticación, email o contraseña incorrectos");
};

routerSessions.post("/register", (req, res) => {
  const { firstName, lastName, email, age, password } = req.body;

  req.session.firstName = firstName;
  req.session.lastName = lastName;
  req.session.email = email;
  req.session.age = age;
  req.session.password = password;
  req.session.admin = false;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.admin = true;
  }

  res.redirect("http://localhost:8080/login");
});

routerSessions.post("/login", auth, (req, res) => {
  req.session.user = true;
  res.redirect("http://localhost:8080/profile");
});

routerSessions.post("/logout", (req, res) => {
  req.session.user = false;
  req.session.destroy((err) => {
    if (err) {
      return res.send(`Error al salir de sesión: ${err}`);
    }

    res.redirect("http://localhost:8080/login");
  });
});

routerSessions.get("/getSession", (req, res) => {
  res.send(req.session);
});

module.exports = routerSessions;
