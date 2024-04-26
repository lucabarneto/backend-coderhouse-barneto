const UserDAO = require("../dao/mongo/user.mongo.js");

const userDAO = new UserDAO();

class UserService {
  constructor() {}

  //Guarda un carrito en la db
  saveUser = async (body) => {
    try {
      if (!body) {
        throw new Error("Body not provided");
      }

      const user = await userDAO.create(body);

      if (user.status) {
        return { status: true, payload: user.payload };
      } else {
        throw new Error(user.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Obtiene un usuario de la db
  getUser = async (email) => {
    try {
      const user = await userDAO.get(email);
      return user;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = UserService;
