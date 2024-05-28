const User = require("../../models/user.model");

class UserMongo {
  constructor() {}

  getByEmail = async (data) => {
    try {
      const user = await User.find({ email: data });

      if (user.length !== 0) {
        return { status: true, payload: user[0] };
      } else {
        return { status: false, payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };

  getById = async (data) => {
    try {
      const user = await User.findById(data);

      if (user.length !== 0) {
        return { status: true, payload: user };
      } else {
        return { status: false, payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };

  create = async (data) => {
    try {
      const user = await User.create(data);
      return { status: true, payload: user };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  update = async (data, update) => {
    try {
      const user = await User.updateOne(data, update);

      return {
        status: true,
        payload: "User updated successfully",
        details: user,
      };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = UserMongo;
