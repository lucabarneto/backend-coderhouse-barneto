const UserDAO = require("../dao/mongo/user.mongo.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const userDAO = new UserDAO();

class UserService {
  constructor() {}

  //Guarda un usuario en la db
  saveUser = async (body) => {
    try {
      if (!body) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("User", "saveUser", [
            body,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const user = await userDAO.create(body);
      return user;
    } catch (err) {
      console.error(err);
    }
  };

  //Obtiene un usuario de la db
  getUserByEmail = async (email) => {
    try {
      if (!email) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("User", "getUserByEmail", [
            email,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const user = await userDAO.getByEmail(email);
      return user;
    } catch (err) {
      console.error(err);
    }
  };

  getUserById = async (id) => {
    try {
      if (!id) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("User", "getUserById", [
            id,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const user = await userDAO.getById(id);
      return user;
    } catch (error) {
      console.error(err);
    }
  };

  updateUserRole = async (user) => {
    try {
      if (!user) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("User", "updateUserRole", [
            user,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      let update;
      if (user.role === "user") {
        update = await userDAO.update(user, {
          $set: { role: "premium" },
        });
      } else if (user.role === "premium") {
        update = await userDAO.update(user, {
          $set: { role: "user" },
        });
      }

      if (update.status) {
        return update;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("updateUserRole", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (error) {
      return { status: false, error: err };
    }
  };
}

module.exports = UserService;
