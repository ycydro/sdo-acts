import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../configs/env.js";

import { User, Role, Permission } from "../models/index.js";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      mobile_number,
      sex,
      email,
      password,
      role_id,
    } = req.body;

    // hash then salt
    const saltRounds = parseInt(env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      first_name,
      last_name,
      mobile_number,
      sex,
      email,
      password: hashedPassword,
      role_id,
    });

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", login);

export default router;
