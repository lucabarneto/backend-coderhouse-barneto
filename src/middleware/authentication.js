const passport = require("passport"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const authenticate = (strategy, options = {}) => {
  try {
    if (
      !strategy ||
      typeof strategy !== "string" ||
      (strategy !== "login" &&
        strategy !== "register" &&
        strategy !== "github" &&
        strategy !== "jwt") ||
      !(options instanceof Object)
    )
      CustomError.createCustomError({
        name: "Invalid authentication strategy error",
        cause: infoError.noAuthStrategyErrorInfo({ strategy, options }),
        message: "There was an error tryng to authenticate the user",
        code: EErrors.SERVER_ERROR,
      });
    //Devuelvo a passport.authenticate
    return async (req, res, next) => {
      try {
        passport.authenticate(strategy, options, function (err, user, info) {
          if (err) return next(err);

          if (!user) {
            return req.policy.includes("public")
              ? next()
              : CustomError.createCustomError({
                  name: "Unauthenticated user Error",
                  cause: infoError.notAuthenticatedErrorInfo(),
                  message: "There was an error tryng to authenticate the user",
                  code: EErrors.UNAUTHENTICATED_USER_ERROR,
                });
          } else {
            req.user = user;
          }

          next();
        })(req, res, next);
      } catch (err) {
        CustomError.handleError(err, res);
      }
    };
  } catch (err) {
    CustomError.handleError(err, res);
  }
};

module.exports = authenticate;
