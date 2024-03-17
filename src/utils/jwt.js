const jwt = require("jsonwebtoken");

const SECRET_KEY = "171916265321163164519213115144";

module.exports = {
  generateToken: (user) => jwt.sign({ user }, SECRET_KEY, { expiresIn: "10h" }),
  validateToken: (token) => jwt.verify(token, SECRET_KEY),
};
