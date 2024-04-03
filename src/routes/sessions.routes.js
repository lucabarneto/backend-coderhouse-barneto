const jwt = require("../utils/jwt.js"),
  Router = require("./custom_router.js"),
  passportCall = require("../middlewares/auth.js");

class SessionRouter extends Router {
  init() {
    //Registra un usuario en la db
    this.post(
      "/register",
      ["PUBLIC"],
      passportCall("register", {
        failureRedirect: "api/sessions/failregister",
        session: false,
      }),
      (req, res) => {
        res.sendRedirect("http://localhost:8080/login");
      }
    );

    //Página por si falla el registro
    this.get("/failregister", ["PUBLIC"], (req, res) => {
      res.sendUserError("Failed to register user");
    });

    // Maneja el login y permite el acceso al perfil
    this.post(
      "/login",
      ["PUBLIC"],
      passportCall("login", {
        failureRedirect: "api/sessions/faillogin",
        session: false,
      }),
      (req, res) => {
        const ACCESS_TOKEN = jwt.generateToken(req.user);

        res.cookie("authCookie", ACCESS_TOKEN, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });

        res.sendRedirect("http://localhost:8080/profile");
      }
    );

    //Página por si falla el login
    this.get("/faillogin", ["PUBLIC"], (req, res) => {
      res.sendUserError("Failed to log in: incorrect user or password");
    });

    // Maneja el acceso a través de github
    this.get(
      "/github",
      ["PUBLIC"],
      passportCall("github", { session: false }),
      (req, res) => {}
    );

    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passportCall("github", { session: false }),
      (req, res) => {
        const ACCESS_TOKEN = jwt.generateToken(req.user);

        res.cookie("authCookie", ACCESS_TOKEN, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        });

        res.sendRedirect("http://localhost:8080/profile");
      }
    );
  }
}

module.exports = SessionRouter;

// //Registra un usuario en la db
// routerSessions.post(
//   "/register",
//   passportCall("register", {
//     failureRedirect: "api/sessions/failregister",
//     session: false,
//   }),
//   (req, res) => {
//     res.redirect("http://localhost:8080/login");
//   }
// );

// routerSessions.get("/failregister", (req, res) => {
//   res.status(400).send("Failed to register user");
// });

// // Maneja el login y permite el acceso al perfil
// routerSessions.post(
//   "/login",
//   passportCall("login", {
//     failureRedirect: "api/sessions/faillogin",
//     session: false,
//   }),
//   (req, res) => {
//     // console.log(req.user);
//     const ACCESS_TOKEN = jwt.generateToken(req.user);

//     res.cookie("authCookie", ACCESS_TOKEN, {
//       maxAge: 60 * 60 * 1000,
//       httpOnly: true,
//     });

//     res.status(200).redirect("http://localhost:8080/profile");
//   }
// );

// routerSessions.get("/faillogin", (req, res) => {
//   res.send("Failed to log in: incorrect user or password");
// });

// routerSessions.get(
//   "/github",
//   passport.authenticate("github", { session: false }),
//   (req, res) => {}
// );

// routerSessions.get(
//   "/githubcallback",
//   passport.authenticate("github", { session: false }),
//   (req, res) => {
//     const ACCESS_TOKEN = jwt.generateToken(req.user);

//     res.cookie("authCookie", ACCESS_TOKEN, {
//       maxAge: 60 * 60 * 1000,
//       httpOnly: true,
//       secure: true,
//     });

//     res.redirect("http://localhost:8080/profile");
//   }
// );

// module.exports = routerSessions;
