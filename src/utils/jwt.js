const jwt = require("jsonwebtoken"),
  config = require("../config/config.js");

module.exports = {
  generateToken: (user) =>
    jwt.sign({ user }, config.secretKey, { expiresIn: "10h" }),
  validateToken: (token) => jwt.verify(token, config.secretKey),
};
