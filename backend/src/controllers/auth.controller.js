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
      { expiresIn: "15d" }
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
