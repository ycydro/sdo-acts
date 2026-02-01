import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../configs/env.js";

import { User, Role, Permission } from "../models/index.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // extract role and permissions
    const roleName = user.role.name;
    const permissions = user.role.permissions.map((p) => p.name);

    const token = jwt.sign(
      {
        id: user.id,
        role: roleName,
        permissions,
        department_id: user.department_id,
      },
      env.JWT_SECRET,
      { expiresIn: "15d" },
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   role: roleName,
      //   permissions,
      //   department_id: user.department_id,
      // },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role_id,
    department_id,
    gender,
    phone_no,
  } = req.body;

  try {
    if (!first_name || !last_name || !email || !password || !role_id) {
      return res.status(400).json({
        message:
          "First name, last name, email, password, and role are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If role is "Staff", department_id is required
    if (role.name.toLowerCase() === "staff" && !department_id) {
      return res.status(400).json({
        message: "Department is required for Staff role",
      });
    }

    // If role is NOT "Staff", department_id should be null
    const finalDepartmentId =
      role.name.toLowerCase() === "staff" ? department_id : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(env.SALT_ROUNDS),
    );

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
      department_id: finalDepartmentId,
      sex: gender,
      mobile_number: phone_no,
    });

    const newUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
