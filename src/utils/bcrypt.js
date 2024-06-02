const bcrypt = require("bcrypt");

class Encryption {
  constructor() {}

  static createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static validatePassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }
}

module.exports = Encryption;
