const EErrors = require("./enum_error.js"),
  infoError = require("./info_error.js");

class CustomError {
  constructor() {}

  static createCustomError = (code, { method = "", message = "" }) => {
    let customError;
    if (
      typeof method !== "string" ||
      typeof message !== "string" ||
      typeof code !== "number"
    ) {
      customError = new Error("There was an error in the server", {
        cause: infoError.CustomError(code, method, message),
      });
      customError.name = "Internal error";
      customError.code = EErrors.INTERNAL;
    }

    switch (code) {
      case EErrors.UNPROVIDED_PARAM:
        customError = new Error("One or more parameters were not provided", {
          cause: `One or more parameters were not provided in the following method: ${method}(). \nUnprovided parameter: ${message}.`,
        });
        customError.name = "Unprovided parameter Error";
        customError.code = code;
        break;

      case EErrors.INVALID_PARAM:
        customError = new Error(
          "One or more parameters did not pass their respective validations.",
          {
            cause: `One or more parameters did not pass their respective validations in the following method: ${method}().\n${message}`,
          }
        );
        customError.name = "Invalid parameter Error";
        customError.code = code;
        break;

      case EErrors.NOT_FOUND:
        customError = new Error(
          "There was an error while searching for the given parameter",
          {
            cause: `The given parameter was not found in the database, in the following method: ${method}().\nParameter searched: ${message}`,
          }
        );
        customError.name = "Not Found Error";
        customError.code = code;
        break;

      case EErrors.ALREADY_IN_DATABASE:
        customError = new Error("Object already inside database", {
          cause: `Cannot create a new document in the method: ${method}(), because it already exists in the database.\n${message}`,
        });
        customError.name = "Existing document Error";
        customError.code = code;
        break;

      case EErrors.UNAUTHENTICATED:
        customError = new Error(
          "There was an error tryng to authenticate the user",
          {
            cause: `User was not authenticated and tried to enter a page that required authentication. User was automatically redirected to /login.`,
          }
        );
        customError.name = "Unauthenticated user Error";
        customError.code = code;
        break;

      case EErrors.FORBIDDEN:
        customError = new Error(
          "User was unauthorized to do a certain action",
          {
            cause: message,
          }
        );
        customError.name = "Authorization error";
        customError.code = code;
        break;

      case EErrors.UNHANDLED_DATABASE:
        customError = new Error(
          "There was an error trying to consult the database",
          {
            cause: `An unhandled error occurred while trying to execute the ${method}() database method.\n${message}`,
          }
        );
        customError.name = "Database error";
        customError.code = code;
        break;

      case EErrors.INTERNAL:
        customError = new Error("There was an error in the server", {
          cause: `There was a server error.\n${message}`,
        });
        customError.name = "Internal error";
        customError.code = code;
        break;

      default:
        customError = new Error("There was an error in the server", {
          cause: infoError.CustomError(code, method, message),
        });
        customError.name = "Internal error";
        customError.code = EErrors.INTERNAL;
        break;
    }

    throw customError;
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

        res.sendAuthorizationError(err.name, err.message);
        break;

      case EErrors.UNHANDLED_DATABASE:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendServerError(err.name, err.message);
        break;

      case EErrors.INTERNAL:
        req.logger.error(`${err.cause} - ${new Date().toLocaleString()}`);

        res.sendServerError(err.name, err.message);
        break;

      default:
        req.logger.fatal(
          `${
            err.message || "An unhandled error has occurred"
          } - ${new Date().toLocaleString()}`
        );

        res.send("UnhandledError");
        break;
    }
  };
}

module.exports = CustomError;
