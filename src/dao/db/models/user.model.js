const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    tel: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
