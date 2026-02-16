import { Op, Sequelize } from "sequelize";
import { Department, Permission, Role, User } from "../models/index.js";
import sequelize from "../configs/sequelize.config.js";

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      department_id = "",
      role_id = "",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = pageNum * limitNum;

    const whereConditions = {};

    if (search && search.trim() != "") {
      const searchText = search.trim();

      whereConditions[Op.or] = [
        Sequelize.where(
          Sequelize.fn(
            "CONCAT",
            Sequelize.col("first_name"),
            " ",
            Sequelize.col("last_name"),
          ),
          {
            [Op.like]: `%${searchText}%`,
          },
        ),
        { email: { [Op.like]: `%${searchText}%` } },
        { first_name: { [Op.like]: `%${searchText}%` } },
        { last_name: { [Op.like]: `%${searchText}%` } },
      ];
    }

    if (department_id) {
      whereConditions.department_id = department_id;
    }

    if (role_id) {
      whereConditions.role_id = role_id;
    }

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      attributes: [
        "id",
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.col("first_name"),
            " ",
            Sequelize.col("last_name"),
          ),
          "full_name",
        ],
        "first_name",
        "last_name",
        "mobile_number",
        "sex",
        "email",
        "createdAt",
      ],
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
        {
          model: Department,
          as: "department",
          attributes: ["id", "name", "department_code"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: limitNum,
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      count,
      data: users,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      message: "Users fetched successfully!",
    });
  } catch (error) {
    console.error("Internal ServerError:", error);
    return res.status(500).json({
      success: false,
      message: "Users failed to fetch.",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    role_id,
    department_id,
    gender,
    phone_no,
  } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!first_name || !last_name || !email || !role_id) {
      return res.status(400).json({
        message: "First name, last name, email, and role are required",
      });
    }

    // Check if email already exists (and it's not the current user's email)
    const existingUser = await User.findOne({ where: { email } });

    // If email exists AND it belongs to a different user, return error
    if (existingUser && existingUser.id !== id) {
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

    const user = await User.update(
      {
        first_name,
        last_name,
        email,
        role_id,
        department_id: finalDepartmentId,
        sex: gender,
        mobile_number: phone_no,
      },
      { where: { id }, transaction },
    );

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Update User error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
