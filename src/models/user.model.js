const mongoose = require("mongoose");

const USER_COLLECTION = "users";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      match: /^\S[a-záéíóúüñ\s]+\S$/i,
    },
    lastName: {
      type: String,
      require: true,
      match: /^\S[a-záéíóúüñ\s]+\S$/i,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      match:
        /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
    },
    tel: {
      type: Number,
      require: true,
      match: /^\d+$/,
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
      match: /^[a-f\d]{24}$/i,
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

const UserModel = mongoose.model(USER_COLLECTION, userSchema);

module.exports = UserModel;
