import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../configs/env.js";

import { User, Role, Permission } from "../models/index.js";
import {
  bulkRegister,
  login,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/register", register);
router.post("/bulk-register", bulkRegister);

// Login
router.post("/login", login);

export default router;
