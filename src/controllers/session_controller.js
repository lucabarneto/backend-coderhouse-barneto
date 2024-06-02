const UserService = require("../services/user_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  AccessToken = require("../utils/jwt.js");

const userService = new UserService();

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

  updateUserRole = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.uid);
      if (user.status === "error") throw user.error;

      const updateRole = await userService.updateUserRole(user.payload);
      if (updateRole.status === "error") throw updateRole.error;

      return res.redirect(303, "/api/sessions/logout");
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = SessionController;
