const User = require("../../models/user.model");

class UserMongo {
  constructor() {}

  getAll = async () => {
    try {
      const users = await User.find();

      return { status: "success", payload: users };
    } catch (error) {
      return { status: "error", error: err.message };
    }
  };

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
      const user = await User.updateOne(data, update);

      return {
        status: "success",
        payload: user,
      };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

  delete = async (data) => {
    try {
      await User.deleteOne(data);
      return { status: "success", payload: "Product deleted successfully" };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };
}

module.exports = UserMongo;
