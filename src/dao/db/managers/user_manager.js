const User = require("../models/user.model.js");

class UserManager {
  constructor() {}

  saveUser = async (body) => {
    try {
      if (!body) {
        throw new Error("Body not provided");
      }

      await User.create(body);

      return { status: true, payload: body };
    } catch (err) {
      console.error(err);
      return { status: false, error: err };
    }
  };

  getUser = async (email) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      return { status: true, payload: user };
    } catch (err) {
      console.error(err);
      return { status: false, error: err };
    }
  };
}

module.exports = UserManager;
