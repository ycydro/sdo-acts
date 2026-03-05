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

export const bulkRegister = async (req, res) => {
  const users = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must be a non-empty array of users" });
  }

  const errors = [];
  const validUsers = [];
  const userEmails = new Set();

  const allRoles = await Role.findAll({ attributes: ["id", "name"] });
  const roleMap = Object.fromEntries(
    allRoles.map((r) => [r.name.toLowerCase(), r]),
  );
  const roleIdMap = Object.fromEntries(allRoles.map((r) => [r.id, r]));

  for (let i = 0; i < users.length; i++) {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      role: roleName,
      department_id,
      sex,
      phone_no,
    } = users[i];

    // Check for duplicate emails in the same batch
    if (userEmails.has(email)) {
      errors.push({
        index: i,
        email,
        message: `Duplicate email in batch: ${email}`,
      });
      continue;
    }

    // Resolve role
    let resolvedRole = role_id ? roleIdMap[role_id] : null;
    if (!resolvedRole && roleName) {
      resolvedRole = roleMap[roleName.toLowerCase()];
    }

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      errors.push({
        index: i,
        email,
        message:
          "Missing required fields (first_name, last_name, email, password)",
      });
      continue;
    }

    if (!resolvedRole) {
      errors.push({
        index: i,
        email,
        message: `Unrecognized role: "${roleName || role_id}"`,
      });
      continue;
    }

    if (resolvedRole.name.toLowerCase() === "staff" && !department_id) {
      errors.push({
        index: i,
        email,
        message: "Department is required for Staff role",
      });
      continue;
    }

    // Hash password and prepare user for bulk insert
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(env.SALT_ROUNDS),
      );

      validUsers.push({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role_id: resolvedRole.id,
        department_id:
          resolvedRole.name.toLowerCase() === "staff"
            ? department_id || null
            : null,
        sex: sex || null,
        mobile_number: phone_no || null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      userEmails.add(email);
    } catch (err) {
      errors.push({ index: i, email, message: "Password hashing failed" });
    }
  }

  if (validUsers.length === 0) {
    return res.status(400).json({
      message: "No valid users to insert",
      errors,
    });
  }

  // Check for existing emails in database
  const existingEmails = await User.findAll({
    where: {
      email: validUsers.map((u) => u.email),
    },
    attributes: ["email"],
  });

  const existingEmailSet = new Set(existingEmails.map((e) => e.email));

  // Filter out users with existing emails
  const finalUsers = [];
  const duplicateErrors = [];

  for (let i = 0; i < validUsers.length; i++) {
    if (existingEmailSet.has(validUsers[i].email)) {
      duplicateErrors.push({
        index: users.findIndex((u) => u.email === validUsers[i].email),
        email: validUsers[i].email,
        message: `Email already exists: ${validUsers[i].email}`,
      });
    } else {
      finalUsers.push(validUsers[i]);
    }
  }

  errors.push(...duplicateErrors);

  if (finalUsers.length === 0) {
    return res.status(400).json({
      message: "All users already exist in database",
      errors,
    });
  }

  // Bulk insert valid users
  try {
    const created = await User.bulkCreate(finalUsers, {
      validate: true,
    });

    return res.status(201).json({
      message: `${created.length} user(s) created successfully${errors.length > 0 ? `, ${errors.length} failed` : ""}`,
      created: created.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    // Handle bulk create errors
    return res.status(500).json({
      message: "Bulk insert failed",
      error: error.message,
      errors,
    });
  }
};
