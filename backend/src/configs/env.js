import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000/",

  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB,
  DB_USER: process.env.DB_USERNAME,
  DB_PASS: process.env.DB_PASSWORD,

  //NODE_ENV: process.env.NODE_ENV || "development",
  //JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  //API_KEY: process.env.API_KEY || "",
};

export default env;
