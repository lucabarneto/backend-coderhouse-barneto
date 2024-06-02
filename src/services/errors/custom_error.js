const EErrors = require("./enum_error.js");

class CustomError {
  constructor() {}

  static createCustomError = ({ name, cause, message, code }) => {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;

    throw error;
  };

  static handleError = (err, req, res) => {
    switch (err.code) {
      case EErrors.UNPROVIDED_PARAM:
        req.logger.warning(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendUserError(err.name, err.message);
        break;

      case EErrors.INVALID_PARAM:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendUserError(err.name, err.message);
        break;

      case EErrors.NOT_FOUND:
        req.logger.warning(`${err.cause} - ${new Date().toLocaleString()}`);

        res.status(404).send({
          status: "error",
          status_code: 404,
          error: err.name,
          message: err.message,
        });
        break;

      case EErrors.ALREADY_IN_DATABASE:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendUserError(err.name, err.message);
        break;

      case EErrors.UNAUTHENTICATED:
        req.logger.info(`${err.cause} - ${new Date().toLocaleString()}`);
        res.sendRedirect("/login");
        break;

      case EErrors.FORBIDDEN:
        req.logger.info(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendAuthorizationError(err.name);
        break;

      case EErrors.UNHANDLED_DATABASE:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendServerError(err.name);
        break;

      default:
        req.logger.fatal(
          `${
            err.cause || "An unhandled error has occurred"
          } - ${new Date().toLocaleString()}`
        );

        res.sendUnhandledError();
        break;
    }
  };
}

module.exports = CustomError;
