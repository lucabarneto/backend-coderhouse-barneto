const jwt = require("jsonwebtoken");

class AccessToken {
  constructor() {}

  static generateToken = (user) =>
    jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1h" });

  static validateToken = (token) => jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = AccessToken;
