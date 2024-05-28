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
      require: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "premium"],
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

userSchema.pre("find", function () {
  this.populate("cart");
});

const UserModel = mongoose.model(userCollection, userSchema);

module.exports = UserModel;
