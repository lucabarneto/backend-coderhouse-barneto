const jwt = require("jsonwebtoken"),
  config = require("../config/config.js");

class AccessToken {
  constructor() {}

  static generateToken = (user) =>
    jwt.sign({ user }, config.secretKey, { expiresIn: "1h" });

  static validateToken = (token) => jwt.verify(token, config.secretKey);
}

module.exports = AccessToken;
