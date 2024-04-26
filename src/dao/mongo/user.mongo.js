const User = require("../../models/user.model");

class UserMongo {
  constructor() {}

  get = async (user) => {
    try {
      const found = await User.find({ email: user });

      if (found.length !== 0) {
        return { status: true, payload: found[0] };
      } else {
        return { status: false, payload: null };
      }
    } catch (err) {
      console.error(err);
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
