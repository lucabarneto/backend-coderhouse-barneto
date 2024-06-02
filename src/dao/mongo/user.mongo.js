const User = require("../../models/user.model");

class UserMongo {
  constructor() {}

  getByEmail = async (data) => {
    try {
      const user = await User.find({ email: data });

      if (user.length !== 0) {
        return { status: "success", payload: user[0] };
      } else {
        return { status: "error", payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };

  getById = async (data) => {
    try {
      const user = await User.findById(data);

      if (user.length !== 0) {
        return { status: "success", payload: user };
      } else {
        return { status: "error", payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };

  create = async (data) => {
    try {
      const user = await User.create(data);
      return { status: "success", payload: user };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      await User.updateOne(data, update);

      return {
        status: "success",
        payload: "User updated successfully",
      };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };
}

module.exports = UserMongo;
