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
    },
    role: {
      type: String,
      enum: ["admin", "user"],
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

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
