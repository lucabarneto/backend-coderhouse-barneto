const infoError = require("../services/errors/info_error.js");

const UserService = require("../services/user_service.js"),
  CartService = require("../services/cart_service.js"),
  Encryption = require("../utils/bcrypt.js"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  GithubStrategy = require("passport-github2").Strategy,
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  ParamValidation = require("../utils/validations.js");

const userService = new UserService(),
  cartService = new CartService();

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
          let { firstName, lastName, tel } = req.body;

          ParamValidation.validatePattern("passport register", /^[a-zñ\d]+$/i, [
            ["password", password],
          ]);

          const userCart = await cartService.addCart();
          if (userCart.status === "error") throw userCart.error;

          const userData = {
            firstName,
            lastName,
            email: username,
            tel,
            password: Encryption.createHash(password),
            cart: userCart.payload._id.toString(),
            role:
              username === process.env.ADMIN_EMAIL &&
              password === process.env.ADMIN_PASSWORD
                ? "admin"
                : "user",
            avatar: "/img/avatar_placeholder.png",
            documents: [],
          };

          const result = await userService.saveUser(userData, "local");
          if (result.status === "error") throw result.error;

          return done(null, result.payload);
        } catch (err) {
          return done(err);
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
          const user = await userService.getUserByEmail(username);
          if (user.status === "error") throw user.error;

          let checkPassword = Encryption.validatePassword(
            user.payload,
            password
          );

          ParamValidation.validateComparison(
            "passport login",
            checkPassword,
            "===",
            true,
            "Incorrect email or password"
          );

          let documents = [];

          user.payload.documents.forEach((doc) => documents.push(doc.name));

          const userDTO = {
            _id: user.payload._id,
            name: `${user.payload.firstName} ${user.payload.lastName}`,
            email: username,
            role: user.payload.role,
            cart: user.payload.cart,
            avatar: user.payload.avatar,
            documents,
          };

          return done(null, userDTO);
        } catch (err) {
          return done(err);
        }
      }
    )
  ); // Fin login Strategy

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let { name, email, login, html_url } = profile._json;

          const userDTO = {
            name: name || login,
            email: email || html_url,
          };

          const user = await userService.getUserByEmail(email || html_url);

          if (user.status === "error") {
            const userCart = await cartService.addCart();
            if (userCart.status === "error") throw userCart.error;

            const githubUser = {
              firstName: name || login,
              lastName: "unprovided",
              email: email || html_url,
              tel: 1,
              password: "unprovided",
              cart: userCart.payload._id.toString(),
              role: "user",
              github: profile,
              documents: [],
              avatar: "/img/avatar_placeholder.png",
            };

            const result = await userService.saveUser(githubUser, "github");
            if (result.status === "error") throw result.error;

            userDTO.cart = userCart.payload;
            userDTO._id = result.payload._id;
            userDTO.documents = [];
            userDTO.avatar = "/img/avatar_placeholder.png";
            userDTO.role = "user";

            return done(null, userDTO);
          } else {
            let documents = [];

            user.payload.documents.forEach((doc) => documents.push(doc.name));

            userDTO._id = user.payload._id;
            userDTO.cart = user.payload.cart;
            userDTO.documents = documents;
            userDTO.avatar = user.payload.avatar;
            userDTO.role = user.payload.role;

            return done(null, userDTO);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  ); // Fin github Strategy

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          ParamValidation.isProvided("passport jwt", [
            ["jwt_payload", jwt_payload],
          ]);

          return done(null, jwt_payload.user);
        } catch (err) {
          return done(err);
        }
      }
    )
  ); //Fin jwt Strategy
};

module.exports = intilializePassport;
