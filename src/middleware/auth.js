const passport = require("passport");

const passportCall = (strategy, options = {}) => {
  // Validaciones de los parámetros
  if (!strategy) return console.warn("No strategy provided");
  if (typeof strategy !== "string")
    return console.error("Argument 'strategy' must be a string");
  if (!(options instanceof Object))
    return console.error("Argument 'options' must be an object");

  //Devuelvo a passport.authenticate
  return async (res, req, next) => {
    passport.authenticate(strategy, options, function (err, user, info) {
      if (err) return next(err);

      if (!user)
        return res
          .status(401)
          .send(info.messages ? info.messages : info.toString());

      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = passportCall;
