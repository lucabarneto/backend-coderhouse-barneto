const User = require("../models/user.model.js");

class UserManager {
  constructor() {}

  //Guarda un carrito en la db
  saveUser = async (body) => {
    try {
      if (!body) {
        throw new Error("Body not provided");
      }

      await User.create(body);

      return { status: true, payload: body };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };

  //Obtiene un usuario de la db
  getUser = async (email) => {
    try {
      const user = await User.find({ email });

      if (!user) {
        throw new Error("User not found");
      }

      return { status: true, payload: user[0] };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };
}

module.exports = UserManager;
