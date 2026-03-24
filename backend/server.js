import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

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
import userRoutes from "./src/routes/user.routes.js";

// MIDDLEWARE IMPORTS
import authenticate from "./src/middleware/authMiddleware.js";

const PORT = env.PORT;
const app = express();
const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARES
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join department-specific room
  socket.on("join-department", (departmentId) => {
    socket.join(`department-${departmentId}`);
    console.log(`Socket ${socket.id} joined department-${departmentId}`);
  });

  // Join all departments room (for queue display monitor)
  socket.on("join-all-departments", () => {
    socket.join("all-departments");
    console.log(`Socket ${socket.id} joined all-departments room`);
  });

  // Leave department room
  socket.on("leave-department", (departmentId) => {
    socket.leave(`department-${departmentId}`);
    console.log(`Socket ${socket.id} left department-${departmentId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/ticket", authenticate, ticketRoutes);
app.use("/api/client-satisfaction", authenticate, clientSatisfactionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// SAME NETWORK
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(` Hosting through network! Listening on port: ${PORT}`);
  console.log(`Socket.IO ready`);
});

export { io };
