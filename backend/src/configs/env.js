import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000/",

  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB,
  DB_USER: process.env.DB_USERNAME,
  DB_PASS: process.env.DB_PASSWORD,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  //NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
  //API_KEY: process.env.API_KEY || "",
};

export default env;
