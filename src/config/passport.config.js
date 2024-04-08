const UserManager = require("../dao/db/services/user_service.js"),
  CartManager = require("../dao/db/services/cart_service.js"),
  bcrypt = require("../utils/bcrypt.js"),
  config = require("../config/config.js"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  GithubStrategy = require("passport-github2").Strategy,
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const userManager = new UserManager(),
  cartManager = new CartManager();

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

          const userCart = await cartManager.addCart();

          const userData = {
            firstName,
            lastName,
            email,
            tel,
            password: bcrypt.createHash(password),
            cart: userCart.payload._id,
            role:
              username === config.admin.email &&
              password === config.admin.password
                ? "admin"
                : "user",
          };

          const result = await userManager.saveUser(userData);
          if (result.status) {
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

          for (const key in user.payload) {
            if (key === "password" || key === "tel" || key === "cart")
              delete key;
          }

          return done(null, user.payload);
        } catch (err) {
          return done(err.message);
        }
      }
    )
  ); // Fin login Strategy

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let { name, email } = profile._json;

          const user = await userManager.getUser(email);

          if (!user.status) {
            const userCart = await cartManager.addCart();

            const githubUser = {
              firstName: name,
              lastName: "",
              email,
              tel: 1111111111,
              password: "",
              cart: userCart.payload._id,
              role: "user",
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
        secretOrKey: config.secretKey,
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
