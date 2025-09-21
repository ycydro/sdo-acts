import express from "express";
import cors from "cors";
import sequelize from "./configs/sequelize.config.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 8080;

app.get("/", async (req, res) => {
  res.send("<h1>Hello, World! (from server)</h1>");
});

app.listen(PORT, console.log(`Listening on port: ${PORT}`));
