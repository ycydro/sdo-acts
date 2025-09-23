import express from "express";
import cors from "cors";

// DB
import sequelize from "./src/configs/sequelize.config.js";
import "./src/models/index.js";

import env from "./src/configs/env.js";

const PORT = env.PORT;
const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ROUTES
app.get("/", async (req, res) => {
  res.send("<h1>Hello, World! (from server)</h1>");
});

app.listen(PORT, console.log(`Listening on port: ${PORT}`));
