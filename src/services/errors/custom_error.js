const EErrors = require("./enum_error.js");

class CustomError {
  constructor() {}

  static createCustomError = ({ name = "error", cause, message, code = 0 }) => {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;

    throw error;
  };

  static handleError = (err, res) => {
    console.error(err.cause);
    switch (err.code) {
      case EErrors.INVALID_PARAM_ERROR:
        res.sendUserError(err.name);
        break;
      case EErrors.INVALID_ID_ERROR:
        res
          .status(404)
          .send({ status: "error", status_code: 404, error: err.name });
        break;
      case EErrors.DATABASE_ERROR:
        res.sendServerError(err.name);
        break;
      case EErrors.SERVER_ERROR:
        res.sendServerError(err.name);
        break;
      case EErrors.UNAUTHENTICATED_USER_ERROR:
        res.sendRedirect("/login");
        break;
      case EErrors.FORBIDDEN_ERROR:
        res.sendAuthorizationError(err.name);
        break;
      default:
        res.sendUnhandledError();
        break;
    }
  };
}

module.exports = CustomError;
