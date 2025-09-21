import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  timezone: "+08:00",
  alter: false,
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((e) => {
    console.error("Database synchronization failed: " + e);
  });

export default sequelize;
