const userManager = require("../dao/db/managers/user_manager.js"),
  bcrypt = require("../utils/bcrypt.js"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  GithubStrategy = require("passport-github2").Strategy;

const intilializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          let { firstName, lastName, email, tel } = req.body;

          let user = await userManager.getUser(username, password);
          if (user) {
            return done(
              "An account already exists with the following email: " + username
            );
          }

          const userData = {
            firstName,
            lastName,
            email,
            tel,
            password: bcrypt.createHash(password),
          };

          let result = await userManager.saveUser(userData);

          delete result.password;
          return done(null, result);
        } catch (err) {
          return done("An error has occurred: " + err);
        }
      }
    )
  ); // Fin register Strategy

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userManager.getUser(username, password);
          if (!user)
            return done("A user with the email " + username + " doesn't exist");

          let checkPassword = bcrypt.validatePassword(user, password);
          if (!checkPassword) return done("Password is incorrect");

          return done(null, user);
        } catch (err) {
          return done("An error has ocurred: " + err);
        }
      }
    )
  ); // Fin login Strategy

  // passport.use("github", new GithubStrategy()); // Fin github Strategy

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};

module.exports = intilializePassport;
