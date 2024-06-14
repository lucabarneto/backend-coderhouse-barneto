const CustomError = require("../services/errors/custom_error.js"),
  AccessToken = require("../utils/jwt.js");

class SessionController {
  registerUser = (req, res) => {
    try {
      return res.sendRedirect("/login");
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  logUser = (req, res) => {
    try {
      const ACCESS_TOKEN = AccessToken.generateToken(req.user);

      res.cookie("authCookie", ACCESS_TOKEN, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.sendRedirect("/");
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  logUserOut = (req, res) => {
    res.clearCookie("authCookie").redirect("/login");
  };

  handleGithub = (req, res) => {};
}

module.exports = SessionController;
