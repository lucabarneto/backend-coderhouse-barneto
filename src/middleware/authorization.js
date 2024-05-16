const CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const authorize = (req, res, next) => {
  try {
    if (!req.user) return next();

    req.policy.includes(req.user.role)
      ? next()
      : CustomError.createCustomError({
          name: "Authorization error",
          cause: infoError.notAuthorizedErrorInfo({
            userRole: req.user.role,
            policy: req.policy,
          }),
          message: "User was unauthorized to enter this page",
          code: EErrors.FORBIDDEN_ERROR,
        });
  } catch (err) {
    CustomError.handleError(err, req, res);
  }
};

module.exports = authorize;
