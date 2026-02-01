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
        "email",
        "createdAt",
        "updatedAt",
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
