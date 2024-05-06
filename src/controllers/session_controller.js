const jwt = require("../utils/jwt.js");

class SessionController {
  registerUser = (req, res) => {
    try {
      return res.sendRedirect("/login");
    } catch (err) {
      return res.sendServerError(err.message);
    }
  };

  logUser = (req, res) => {
    try {
      const ACCESS_TOKEN = jwt.generateToken(req.user);

      res.cookie("authCookie", ACCESS_TOKEN, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.sendRedirect("/profile");
    } catch (err) {
      return res.sendServerError(err.message);
    }
  };

  handleGithub = (req, res) => {};
}

module.exports = SessionController;
