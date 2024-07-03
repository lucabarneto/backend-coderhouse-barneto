const UserService = require("../services/user_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  ParamValidation = require("../utils/validations.js");

const userService = new UserService();

class UserController {
  constructor() {}

  handleUid = async (req, res, next, uid) => {
    try {
      const user = await userService.getUserById(uid);

      if (user.status === "success") {
        req.logger.http(
          `The given uid (${uid}) was found inside the database - ${new Date().toLocaleString()}`
        );
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

      const avatar = {
        filedname: req.file.fieldname,
        files: [`/uploads/avatars/${req.file.filename}`],
      };

      const upload = await userService.uploadFile(avatar, req.user);
      if (upload.status === "success") {
        req.logger.http(
          `Avatar uploaded successfully - ${new Date().toLocaleString()}`
        );
        return res.redirect(303, "/api/sessions/logout");
      } else {
        throw upload.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };

  uploadDocuments = async (req, res) => {
    try {
      ParamValidation.validateAuthorization(
        "uploadDocuments",
        req.params.uid,
        req.user._id
      );

      let files = [];

      req.files.forEach((file) => {
        files.push({
          name: file.originalname.trim().split(".")[0],
          path: `/uploads/documents/${file.filename}`,
        });
      });

      const documents = {
        fieldname: "documents",
        files,
      };

      const upload = await userService.uploadFile(documents, req.user);
      if (upload.status === "success") {
        req.logger.http(
          `Documents uploaded successfully - ${new Date().toLocaleString()}`
        );
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
        req.logger.http(
          `User role updated successfully - ${new Date().toLocaleString()}`
        );
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
