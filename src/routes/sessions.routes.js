const Router = require("./custom_router.js"),
  SessionController = require("../controllers/session_controller.js"),
  passport = require("passport");

const sessionController = new SessionController();

class SessionRouter extends Router {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/failregister",
        session: false,
      }),
      sessionController.registerUser
    );

    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/faillogin",
        session: false,
      }),
      sessionController.logUser
    );

    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { session: false }),
      sessionController.handleGithub
    );

    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passport.authenticate("github", { session: false }),
      sessionController.logUser
    );
  }
}

module.exports = SessionRouter;
