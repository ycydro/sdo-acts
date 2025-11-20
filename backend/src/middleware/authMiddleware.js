// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { User, Role, Permission } from "../models/index.js";
import env from "../configs/env.js";

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3. Find user in database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }, // Don't send password
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

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    // extract role and permissions
    const roleName = user.role.name;
    const permissions = user.role.permissions.map((p) => p.name);

    const authenticatedUser = {
      id: user.id,
      email: user.email,
      role: roleName,
      department_id: user.department_id,
      permissions,
    };

    console.log(authenticatedUser, "USER FROM AUTH MIDDLEWARE");

    // 4. Attach user to request object
    req.user = authenticatedUser;

    next(); // Continue to the next middleware/route
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticate;
