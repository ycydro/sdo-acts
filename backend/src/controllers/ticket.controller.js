import sequelize from "../configs/sequelize.config.js";

import { Ticket } from "../models/index.js";

// export const getAllDepartments = async (req, res) => {
//   try {
//     const departments = await Department.findAll({
//       order: [["createdAt", "DESC"]],
//     });

//     return res.status(200).json({
//       success: true,
//       data: departments,
//       message: "Departments fetched successfuly!",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Department failed to fetch.",
//     });
//   }
// };

export const createTicket = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { service_id, details, client_id, scheduled_date, is_online } =
      req.body;

    const department = await Ticket.create(
      {
        service_id,
        status: "Open",
        details,
        client_id,
        scheduled_date: scheduled_date || null,
        is_online,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({
      success: true,
      message: "Ticket created successfully!",
      department,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating ticket:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the ticket.",
      error: err.message,
    });
  }
};

// export const updateDepartment = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { name, description, department_code, status } = req.body;

//     const upperCasedDeptCode = department_code.toUpperCase();

//     await Department.update(
//       {
//         name,
//         description,
//         status: status || "active",
//         department_code: upperCasedDeptCode,
//       },
//       { where: { id }, transaction }
//     );

//     await transaction.commit();
//     res.status(200).json({
//       success: true,
//       message: "Department updated successfully!",
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.error("Error updating department:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the department.",
//       error: err.message,
//     });
//   }
// };

// export const deleteDepartment = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { id } = req.params;

//     await Department.destroy({
//       where: {
//         id,
//       },
//       transaction,
//     });
//     await transaction.commit();
//     res.status(200).json({
//       success: true,
//       message: "Department deleted successfully!",
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.error("Error deleting department:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the department.",
//       error: err.message,
//     });
//   }
// };
