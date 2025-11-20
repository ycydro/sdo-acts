import jwt from "jsonwebtoken";
import { User, Role, Permission } from "../models/index.js";
import env from "../configs/env.js";

const authenticate = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // find user in database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
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
      role: roleName,
      department_id: user.department_id,
      permissions,
    };

    console.log(authenticatedUser, "USER FROM AUTH MIDDLEWARE");

    req.user = authenticatedUser;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticate;
