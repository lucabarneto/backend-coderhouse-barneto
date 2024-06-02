const passport = require("passport"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const authenticate = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, options, function (err, user, info) {
      try {
        ParamValidation.isProvided("authenticate", ["strategy", strategy]);
        ParamValidation.validatePattern(
          "authenticate",
          /^(login|register|github|jwt)$/,
          [["strategy", strategy]],
          infoError.noAuthStrategy({ strategy, options })
        );
        ParamValidation.validateDatatype(
          "authenticate",
          "object",
          [["options", options]],
          infoError.noAuthStrategy({ strategy, options })
        );

        if (err) {
          throw err;
        }

        if (!user) {
          return req.policy.includes("public")
            ? next()
            : CustomError.createCustomError({
                name: "Unauthenticated user Error",
                cause: infoError.notAuthenticated(),
                message: "There was an error tryng to authenticate the user",
                code: EErrors.UNAUTHENTICATED,
              });
        } else {
          req.user = user;
        }

        next();
      } catch (err) {
        CustomError.handleError(err, req, res);
      }
    })(req, res, next);
  };
};

module.exports = authenticate;
