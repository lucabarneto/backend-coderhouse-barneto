const UserDAO = require("../dao/mongo/user.mongo.js"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const userDAO = new UserDAO();

class UserService {
  constructor() {}

  saveUser = async (user, strategy) => {
    try {
      let { firstName, lastName, email, tel, password, cart, role } = user;

      ParamValidation.isProvided("saveUser", [
        ["strategy", strategy],
        ["firstName", firstName],
        ["lastName", lastName],
        ["email", email],
        ["tel", tel],
        ["password", password],
        ["cart", cart],
        ["role", role],
      ]);

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
        CustomError.createCustomError(EErrors.ALREADY_IN_DATABASE, {
          method: "saveUser",
        });

      const result = await userDAO.create(user);
      if (result.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.create",
          message: result.error,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getUserByEmail = async (email) => {
    try {
      ParamValidation.isProvided("getUserByEmail", [["email", email]]);
      ParamValidation.validatePattern(
        "getuserByEmail",
        /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
        [["email", email]]
      );

      const user = await userDAO.getByEmail(email);
      if (user.status === "error")
        CustomError.createCustomError(EErrors.NOT_FOUND, {
          method: "getUserByEmail",
          message: email,
        });

      return user;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getUserById = async (id) => {
    try {
      ParamValidation.isProvided("getUserById", [["id", id]]);
      ParamValidation.validatePattern("passport register", /^[a-f\d]{24}$/i, [
        ["id", id],
      ]);

      const user = await userDAO.getById(id);
      if (user.status === "error")
        CustomError.createCustomError(EErrors.NOT_FOUND, {
          method: "getUserById",
          message: id,
        });

      return user;
    } catch (error) {
      return { status: "error", error: err };
    }
  };

  updateUserRole = async (user) => {
    try {
      ParamValidation.isProvided("updateUserRole", [["user", user]]);

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
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.update",
          message: update.error,
        });

      return update;
    } catch (error) {
      return { status: "error", error: err };
    }
  };
}

module.exports = UserService;
