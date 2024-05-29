const UserService = require("../services/user_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  jwt = require("../utils/jwt.js");

const userService = new UserService();

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

      return res.sendRedirect("/");
    } catch (err) {
      console.log("Hubo un error: ", err);
      return res.sendServerError(err.message);
    }
  };

  logUserOut = (req, res) => {
    res.clearCookie("authCookie").redirect("/login");
  };

  handleGithub = (req, res) => {};

  updateUserRole = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.uid);

      const updateRole = await userService.updateUserRole(user.payload);

      if (updateRole.status) {
        return res.redirect(303, "/api/sessions/logout");
      } else {
        throw updateRole.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = SessionController;
