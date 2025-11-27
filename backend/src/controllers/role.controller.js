import env from "../configs/env.js";
import sequelize from "../configs/sequelize.config.js";

import { Role, Permission } from "../models/index.js";

export const getAllRoleWithPermissions = async (req, res) => {
  try {
    const rolesWithPermissions = await Role.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "RolePermission"],
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: rolesWithPermissions,
      message: "Departments fetched successfuly!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Department failed to fetch.",
    });
  }
};

// export const createDepartment = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { name, description, status, department_code } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Name is required.",
//       });
//     }

//     const upperCasedDeptCode = department_code.toUpperCase();

//     const existingDeptCode = await Department.findOne({
//       where: {
//         department_code: upperCasedDeptCode,
//       },
//     });

//     if (existingDeptCode) {
//       await transaction.rollback();
//       return res.status(409).json({
//         success: false,
//         message: "Department Code already exists!",
//       });
//     }

//     const department = await Department.create(
//       {
//         name,
//         description,
//         status: status || "active",
//         department_code: upperCasedDeptCode,
//       },
//       { transaction }
//     );

//     await transaction.commit();
//     res.status(201).json({
//       success: true,
//       message: "Department created successfully!",
//       department,
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.error("Error creating department:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the department.",
//       error: err.message,
//     });
//   }
// };
