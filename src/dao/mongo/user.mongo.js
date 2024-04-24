const User = require("../../models/user.model");

class UserMongo {
  constructor() {}

  get = async (user) => {
    try {
      const found = await User.find({ user });
      return { status: true, payload: found };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  create = async (user) => {
    try {
      const created = await User.create(user);
      return { status: true, payload: created };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = UserMongo;
