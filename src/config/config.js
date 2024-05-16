const dotenv = require("dotenv"),
  { Command } = require("commander");

const program = new Command();

program
  .option(
    "-m, --mode <mode>",
    "Sets the environment to work with",
    "development"
  )
  .parse();

dotenv.config({
  path: program.opts().mode === "production" ? "./.env.prod" : "./.env.dev",
});

const config = {
  mode: process.env.MODE,
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
