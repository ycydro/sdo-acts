import sequelize from "../configs/sequelize.config.js";

import { Ticket, Service, Department, User } from "../models/index.js";
import { Op, Sequelize } from "sequelize";

export const getAllTickets = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      status = "", // galing buildqueryparams
      department_id = "", // galing buildqueryparams
    } = req.query;

    const user = req.user;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = pageNum * limitNum;

    const whereConditions = {};

    // search
    if (search && search.trim() != "") {
      const searchText = search.trim();
      whereConditions[Op.or] = [
        { ticket_code: { [Op.like]: `%${searchText}%` } },
        { "$service.name$": { [Op.like]: `%${searchText}%` } },
        { "$client.first_name$": { [Op.like]: `%${searchText}%` } },
        { "$client.last_name$": { [Op.like]: `%${searchText}%` } },
      ];
    }

    // status filter
    if (status) {
      whereConditions.status = status;
    }

    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    } else if (department_id) {
      whereConditions["$service.department_id$"] = department_id;
    }

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Service,
          as: "service",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "description",
              "status",
              "department_id",
            ],
          },
          include: [
            {
              model: Department,
              attributes: ["id", "name", "department_code"],
            },
          ],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name"],
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
      data: tickets,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      message: "Tickets fetched successfully!",
    });
  } catch (error) {
    console.error("Internal ServerError:", error);
    return res.status(500).json({
      success: false,
      message: "Tickets failed to fetch.",
      error: error.message,
    });
  }
};

export const getTicketStatusCount = async (req, res) => {
  try {
    const user = req.user;

    const whereConditions = {};

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    }

    const result = await Ticket.findAll({
      attributes: [
        [Sequelize.col("Ticket.status"), "status"],
        [Sequelize.fn("COUNT", Sequelize.col("Ticket.status")), "count"],
      ],
      include: [
        {
          model: Service,
          as: "service",
          attributes: [],
        },
      ],
      where: whereConditions,
      group: ["Ticket.status"],
    });

    const counts = {
      "Unapproved Tickets": 0,
      "Pending Tickets": 0,
      "Ongoing Tickets": 0,
      "Resolved Tickets": 0,
    };

    result.forEach((row) => {
      const status = row.getDataValue("status");
      const count = Number(row.getDataValue("count"));

      if (status === "Unapproved") counts["Unapproved Tickets"] = count;
      else if (status === "Pending") counts["Pending Tickets"] = count;
      else if (status === "Ongoing") counts["Ongoing Tickets"] = count;
      else if (status === "Resolved") counts["Resolved Tickets"] = count;
    });

    return res.status(200).json({
      success: true,
      data: counts,
      message: "Ticket status count fetched successfully!",
    });
  } catch (error) {
    console.error("Internal ServerError:", error);
    return res.status(500).json({
      success: false,
      message: "Ticket status count failed to fetch.",
      error: error.message,
    });
  }
};

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
