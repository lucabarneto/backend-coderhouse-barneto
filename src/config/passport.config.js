const UserManager = require("../dao/db/managers/user_manager.js"),
  bcrypt = require("../utils/bcrypt.js"),
  jwt = require("../utils/jwt.js"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  GithubStrategy = require("passport-github2").Strategy,
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const userManager = new UserManager();

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["authCookie"];
  }

  return token;
};

const intilializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          let { firstName, lastName, email, tel } = req.body;

          const user = await userManager.getUser(username);
          if (user.status) {
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

          const result = await userManager.saveUser(userData);
          if (result.status) {
            delete result.payload.password;
            return done(null, result.payload);
          } else {
            return done(result.error);
          }
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
          const user = await userManager.getUser(username);
          if (!user.status)
            return done("A user with the email " + username + " doesn't exist");

          let checkPassword = bcrypt.validatePassword(user.payload, password);
          if (!checkPassword) return done("Password is incorrect");

          return done(null, user.payload);
        } catch (err) {
          return done("An error has ocurred: " + err);
        }
      }
    )
  ); // Fin login Strategy

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.838f112f9c4e13a5",
        clientSecret: "6e4fe51857e76252a337e71e22ad70fdaa20268f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let { name, email } = profile._json;

          const user = await userManager.getUser(email);

          if (!user.status) {
            const githubUser = {
              firstName: name,
              lastName: "",
              email,
              tel: 1111111111,
              password: "",
              github: profile,
            };

            const result = await userManager.saveUser(githubUser);

            if (result.status) {
              return done(null, result.payload);
            } else {
              return done(result.error);
            }
          } else {
            return done(null, user.payload);
          }
        } catch (err) {
          return done("An error has occurred: " + err);
        }
      }
    )
  ); // Fin github Strategy

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "171916265321163164519213115144",
      },
      async (jwt_payload, done) => {
        try {
          if (!jwt_payload) return done("No payload from jwt");

          return done(null, jwt_payload.user);
        } catch (err) {
          return done("An error has occurred: " + err);
        }
      }
    )
  ); //Fin jwt Strategy
};

module.exports = intilializePassport;
