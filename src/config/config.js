const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  secretKey: process.env.SECRET_KEY,
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
};

module.exports = config;
