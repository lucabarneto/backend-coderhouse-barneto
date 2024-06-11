const CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const authorize = (req, res, next) => {
  try {
    if (!req.user) return next();

    req.policy.includes(req.user.role)
      ? next()
      : CustomError.createCustomError(EErrors.FORBIDDEN, {
          message: infoError.IncorrectUserRole(req.user.role, req.policy),
        });
  } catch (err) {
    CustomError.handleError(err, req, res);
  }
};

module.exports = authorize;
