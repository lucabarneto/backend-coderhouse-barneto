const User = require("../models/user.model.js");

module.exports = {
  saveUser: async (body) => {
    try {
      if (!body) {
        throw new Error("Body not provided");
      }

      await User.create(body);

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
  getUser: async (email, password) => {
    try {
      if (!email) {
        throw new Error("Email not provided");
      }
      if (!password) {
        throw new Error("Password not provided");
      }

      const user = await User.find({ email, password });

      if (!user) {
        return false;
      }

      return true;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
};
