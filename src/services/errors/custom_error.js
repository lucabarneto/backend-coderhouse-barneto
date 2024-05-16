const EErrors = require("./enum_error.js");

class CustomError {
  constructor() {}

  static createCustomError = ({ name = "error", cause, message, code = 0 }) => {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;

    throw error;
  };

  static handleError = (err, req, res) => {
    switch (err.code) {
      case EErrors.INVALID_PARAM_ERROR:
        req.logger.warning(
          `${`${
            err.cause
          } - ${new Date().toLocaleString()}`} - ${new Date().toLocaleString()}`
        );
        res.sendUserError(err.name);
        break;
      case EErrors.INVALID_ID_ERROR:
        req.logger.warning(`${err.cause} - ${new Date().toLocaleString()}`);
        res
          .status(404)
          .send({ status: "error", status_code: 404, error: err.name });
        break;
      case EErrors.DATABASE_ERROR:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);
        res.sendServerError(err.name);
        break;
      case EErrors.SERVER_ERROR:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);
        res.sendServerError(err.name);
        break;
      case EErrors.UNAUTHENTICATED_USER_ERROR:
        req.logger.info(`${err.cause} - ${new Date().toLocaleString()}`);
        res.sendRedirect("/login");
        break;
      case EErrors.FORBIDDEN_ERROR:
        req.logger.info(`${err.cause} - ${new Date().toLocaleString()}`);
        res.sendAuthorizationError(err.name);
        break;
      default:
        req.logger.fatal(
          `An unhandled error has occurred - ${new Date().toLocaleString()}`
        );
        res.sendUnhandledError();
        break;
    }
  };
}

module.exports = CustomError;
