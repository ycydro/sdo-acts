import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize = new Sequelize({
  host: env.DB_HOST,
  database: env.DB_NAME,
  dialect: "mysql",
  username: env.DB_USER,
  password: env.DB_PASS,
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
