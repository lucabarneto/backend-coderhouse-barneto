const UserService = require("../services/user_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");
const ParamValidation = require("../utils/validations.js");

const userService = new UserService();

class UserController {
  constructor() {}

  handleUid = async (req, res, next, uid) => {
    try {
      const user = await userService.getUserById(uid);

      if (user.status === "success") {
        next();
      } else {
        throw user.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  uploadAvatar = async (req, res) => {
    try {
      ParamValidation.validateAuthorization(
        "uploadAvatar",
        req.params.uid,
        req.user._id
      );

      const avatar = `/uploads/avatars/${req.file.filename}`;

      const upload = await userService.uploadFile(avatar, req.user);
      if (upload.status === "success") {
        return res.redirect(303, "/api/sessions/logout");
      } else {
        throw upload.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  updateUserRole = async (req, res) => {
    try {
      const updateRole = await userService.updateRole(req.user);
      if (updateRole.status === "success") {
        return res.redirect(303, "/api/sessions/logout");
      } else {
        throw updateRole.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = UserController;
