const UserDAO = require("../dao/mongo/user.mongo.js");

const userDAO = new UserDAO();

class UserService {
  constructor() {}

  //Guarda un usuario en la db
  saveUser = async (body) => {
    try {
      const user = await userDAO.create(body);
      return user;
    } catch (err) {
      console.error(err);
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
