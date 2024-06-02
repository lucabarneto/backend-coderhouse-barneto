const UserDAO = require("../dao/mongo/user.mongo.js"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const userDAO = new UserDAO();

class UserService {
  constructor() {}

  saveUser = async (user, strategy) => {
    try {
      let { firstName, lastName, email, tel, password, cart, role } = user;

      ParamValidation.isProvided(
        "saveUser",
        ["strategy", strategy],
        ["firstName", firstName],
        ["lastName", lastName],
        ["email", email],
        ["tel", tel],
        ["password", password],
        ["cart", cart],
        ["role", role]
      );

      ParamValidation.validatePattern("saveUser", /^(local|github)$/, [
        ["strategy", strategy],
      ]);
      ParamValidation.validatePattern("saveUser", /^\S[a-záéíóúüñ\s]+\S$/i, [
        ["firstName", firstName],
        ["lastName", lastName],
      ]);

      ParamValidation.validatePattern(
        "saveUser",
        /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
        [["email", email]]
      );

      ParamValidation.validatePattern("saveUser", /^\d+$/, [["tel", tel]]);
      ParamValidation.validatePattern("saveUser", /^[a-f\d]{24}$/i, [
        ["cart", cart],
      ]);
      ParamValidation.validatePattern("saveUser", /^(admin|user|premium)$/, [
        ["role", role],
      ]);

      const alreadyExists = await userDAO.getByEmail(email);
      if (alreadyExists.status === "success")
        CustomError.createCustomError({
          name: "Existing user Error",
          cause: infoError.objectAlreadyInDatabase("saveUser"),
          message:
            "An account already exists with the following email: " + email,
          code: EErrors.ALREADY_IN_DATABASE,
        });

      const result = await userDAO.create(user);
      if (result.status === "error")
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.unhandledDatabase("userDAO.create", result.error),
          message: "There was an error trying to consult the database",
          code: EErrors.UNHANDLED_DATABASE,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getUserByEmail = async (email) => {
    try {
      ParamValidation.isProvided("getUserByEmail", ["email", email]);
      ParamValidation.validatePattern(
        "getuserByEmail",
        /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
        [["email", email]]
      );

      const user = await userDAO.getByEmail(email);
      if (user.status === "error")
        CustomError.createCustomError({
          name: "Not Found Error",
          cause: infoError.userNotFound(email),
          message: "There was an error while searching for the given user",
          code: EErrors.NOT_FOUND,
        });

      return user;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getUserById = async (id) => {
    try {
      ParamValidation.isProvided("getUserById", ["id", id]);
      ParamValidation.validatePattern("passport register", /^[a-f\d]{24}$/i, [
        ["id", id],
      ]);

      const user = await userDAO.getById(id);
      if (user.status === "error")
        CustomError.createCustomError({
          name: "Not Found Error",
          cause: infoError.idNotFound(id, "users"),
          message: "There was an error while searching for the given id",
          code: EErrors.NOT_FOUND,
        });

      return user;
    } catch (error) {
      return { status: "error", error: err };
    }
  };

  updateUserRole = async (user) => {
    try {
      ParamValidation.isProvided("updateUserRole", ["user", user]);

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

      if (update.status === "error")
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.unhandledDatabase("userDAO.update", update.error),
          message: "There was an error trying to consult the database",
          code: EErrors.UNHANDLED_DATABASE,
        });

      return update;
    } catch (error) {
      return { status: "error", error: err };
    }
  };
}

module.exports = UserService;
