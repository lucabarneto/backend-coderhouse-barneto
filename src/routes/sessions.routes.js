const Router = require("./custom_router.js"),
  SessionController = require("../controllers/session_controller.js"),
  authenticate = require("../middleware/authentication.js");

const sessionController = new SessionController();

class SessionRouter extends Router {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      authenticate("register", {
        failureRedirect: "/failregister",
        session: false,
      }),
      sessionController.registerUser
    );

    this.post(
      "/login",
      ["PUBLIC"],
      authenticate("login", {
        failureRedirect: "/faillogin",
        session: false,
      }),
      sessionController.logUser
    );

    this.get(
      "/github",
      ["PUBLIC"],
      authenticate("github", { session: false }),
      sessionController.handleGithub
    );

    this.get(
      "/githubcallback",
      ["PUBLIC"],
      authenticate("github", { session: false }),
      sessionController.logUser
    );
  }
}

module.exports = SessionRouter;
