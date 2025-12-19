import express from "express";
import cors from "cors";

// DB
import sequelize from "./src/configs/sequelize.config.js";
import "./src/models/index.js";

import env from "./src/configs/env.js";

// ROUTES
import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import clientSatisfactionRoutes from "./src/routes/client-satisfaction.routes.js";
import roleRoutes from "./src/routes/role.routes.js";

// MIDDLEWARE IMPORTS
import authenticate from "./src/middleware/authMiddleware.js";

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

// KAPAG HOST SA SAME NETWORK
// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/ticket", authenticate, ticketRoutes);
app.use("/api/client-satisfaction", authenticate, clientSatisfactionRoutes);
app.use("/api/role", roleRoutes);

app.get("/", async (req, res) => {
  res.send("<h1>Hello, World! (from server)</h1>");
});

app.listen(PORT, console.log(`Listening on port: ${PORT}`));

// app.listen(
//   PORT,
//   "0.0.0.0",
//   console.log(`Hosting through network! Listening on port: ${PORT}`)
// );
