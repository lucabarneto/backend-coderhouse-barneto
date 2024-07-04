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

  getUsers = async () => {
    try {
      const users = await userDAO.getAll();

      if (users.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.getAll",
          message: users.error,
        });

      let usersDTO = [];

      users.payload.forEach((user) => {
        usersDTO.push({
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        });
      });

      return { status: "success", payload: usersDTO };
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
      ParamValidation.validatePattern("getUserById", /^[a-f\d]{24}$/i, [
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

  uploadFile = async (file, user) => {
    try {
      let { fieldname, files } = file;

      ParamValidation.isProvided("uploadFile", [
        ["user", user],
        ["fieldname", fieldname],
        ["files", files],
      ]);
      ParamValidation.validatePattern("uploadFile", /^(avatar|documents)$/, [
        ["fieldname", fieldname],
      ]);
      ParamValidation.validateDatatype("uploadFile", "array", files);
      ParamValidation.validateComparison("uploadFile", files.length, "!==", 0);

      let update;

      switch (fieldname) {
        case "avatar":
          update = { $set: { avatar: files[0] } };
          break;
        case "documents":
          files.forEach((file) => {
            ParamValidation.validatePattern(
              "uploadFile",
              /^(identification|address|account_status)$/,
              [["file.name", file.name]]
            );
          });

          update = { $addToSet: { documents: { $each: files } } };
          break;
      }

      const upload = await userDAO.getById(user._id);
      if (upload.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.getById",
          message: upload.error,
        });

      const result = await userDAO.update({ _id: user._id }, update);
      if (result.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.update",
          message: result.error,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  updateRole = async (user) => {
    try {
      let { _id, role } = user;
      ParamValidation.isProvided("updateRole", [
        ["_id", _id],
        ["role", role],
      ]);

      let update = await userDAO.update(
        { _id: _id },
        { $set: { role: role === "user" ? "premium" : "user" } }
      );

      if (update.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.update",
          message: update.error,
        });

      return update;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  deleteUser = async (data) => {
    try {
      ParamValidation.isProvided("deleteUser", [["data", data]]);

      const result = await userDAO.delete(data);
      if (result.status === "error")
        CustomError.createCustomError(EErrors.UNHANDLED_DATABASE, {
          method: "userDAO.delete",
          message: result.error,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };
}

module.exports = UserService;
