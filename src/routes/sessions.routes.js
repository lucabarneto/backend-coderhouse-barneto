const jwt = require("../utils/jwt.js"),
  Router = require("./custom_router.js"),
  passport = require("passport");

class SessionRouter extends Router {
  init() {
    //Registra un usuario en la db
    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "api/sessions/failregister",
        session: false,
      }),
      (req, res) => {
        try {
          return res.sendRedirect("http://localhost:8080/login");
        } catch (err) {
          return res.sendServerError(err.message);
        }
      }
    );

    //Página por si falla el registro
    this.get("/failregister", ["PUBLIC"], (req, res) => {
      try {
        return res.sendUserError("Failed to register user");
      } catch (err) {
        return res.sendServerError(err.message);
      }
    });

    // Maneja el login y permite el acceso al perfil
    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "api/sessions/faillogin",
        session: false,
      }),
      (req, res) => {
        try {
          const ACCESS_TOKEN = jwt.generateToken(req.user);

          res.cookie("authCookie", ACCESS_TOKEN, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
          });

          return res.sendRedirect("http://localhost:8080/profile");
        } catch (err) {
          return res.sendServerError(err.message);
        }
      }
    );

    //Página por si falla el login
    this.get("/faillogin", ["PUBLIC"], (req, res) => {
      try {
        return res.sendUserError(
          "Failed to log in: incorrect user or password"
        );
      } catch (err) {
        return res.sendServerError(err.message);
      }
    });

    // Maneja el acceso a través de github
    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { session: false }),
      (req, res) => {}
    );

    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passport.authenticate("github", { session: false }),
      (req, res) => {
        try {
          const ACCESS_TOKEN = jwt.generateToken(req.user);

          res.cookie("authCookie", ACCESS_TOKEN, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
          });

          return res.sendRedirect("http://localhost:8080/profile");
        } catch (err) {
          return res.sendServerError(err.message);
        }
      }
    );
  }
}

module.exports = SessionRouter;
