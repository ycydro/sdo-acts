import sequelize from "../configs/sequelize.config.js";
import { statusHandlers } from "../helpers/statusHandlers.js";

import {
  Ticket,
  Service,
  Department,
  User,
  ClientSurveyResponse,
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";
import { emitQueueUpdate } from "./queue.controller.js";
import { sendEmail } from "../helpers/emails/sendEmail.js";
import ticketCreatedEmailTemplate from "../helpers/emails/templates/ticketCreatedEmailTemplate.js";
import { sendEmailBasedOnTicketStatus } from "../helpers/emails/sendEmailBasedOnTicketStatus.js";

export const getAllTickets = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      status = "", // galing buildqueryparams
      priority = "",
      department_id = "", // galing buildqueryparams
    } = req.query;

    const sortByPriority =
      req.query.sortByPriority === undefined ||
      req.query.sortByPriority === null;

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
    } else {
      whereConditions.status = { [Op.notIn]: ["Resolved", "In Queue"] };
    }

    // priority filter
    if (priority) {
      whereConditions["$service.priority$"] = priority;
    }

    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    } else if (department_id) {
      whereConditions["$service.department_id$"] = department_id;
    }

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where: whereConditions,
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
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN \`ticket\`.\`status\` = 'Unapproved' THEN 1
              WHEN \`ticket\`.\`status\` = 'Ongoing' THEN 2
              WHEN \`ticket\`.\`status\` = 'In Queue' THEN 3
              WHEN \`ticket\`.\`status\` = 'Resolved' THEN 4
              WHEN \`ticket\`.\`status\` = 'Declined' THEN 5
              ELSE 6
            END
          `),
          "ASC",
        ],

        ...(sortByPriority
          ? [
              [
                Sequelize.literal(`
            CASE 
              WHEN \`service\`.\`priority\` = 'High' THEN 1
              WHEN \`service\`.\`priority\` = 'Medium' THEN 2
              WHEN \`service\`.\`priority\` = 'Low' THEN 3
              ELSE 4
            END
          `),
                "ASC",
              ],
            ]
          : []),

        ["createdAt", "DESC"],
      ],

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

export const getTicketByID = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      include: [
        {
          model: Service,
          as: "service",
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
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      data: ticket,
      message: "Ticket fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ticket failed to fetch.",
      error: error.message,
    });
  }
};

export const getTicketStatusCount = async (req, res) => {
  try {
    const user = req.user;

    const whereConditions = {};

    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    }

    const result = await Ticket.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("Ticket.id")), "count"],
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
      raw: true,
    });

    const counts = {
      "In Queue": 0,
      "On hold": 0,
      Ongoing: 0,
      Resolved: 0,
    };

    for (const row of result) {
      counts[row.status] = Number(row.count);
    }

    return res.status(200).json({
      success: true,
      data: counts,
      message: "Ticket status count fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ticket status count failed to fetch.",
      error: error.message,
    });
  }
};

export const getUsersCurrentActiveTicket = async (req, res) => {
  try {
    const user = req.user;

    const ticket = await Ticket.findOne({
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["name", "processing_time_in_minutes"],
        },
      ],
      where: {
        client_id: user.id,
        status: {
          [Op.notIn]: ["Resolved", "Declined"],
        },
      },
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: ticket,
      message: "Active Ticket fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Active Ticket failed to fetch.",
      error: error.message,
    });
  }
};

export const getUsersTransactionHistory = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;

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

    whereConditions.client_id = user.id ?? "";
    whereConditions.status = "Resolved";

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where: whereConditions,
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
      message: "Transaction History fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Transaction History failed to fetch.",
      error: error.message,
    });
  }
};

export const createTicket = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      service_id,
      details,
      client_id,
      scheduled_date,
      confirmation_date,
      is_online,
    } = req.body;

    const latestResolvedTicket = await Ticket.findOne({
      where: {
        client_id,
        status: "Resolved",
      },
      order: [["createdAt", "DESC"]],
      transaction,
    });

    let hasPendingSurvey = false;
    let pendingSurveyData = null;

    if (latestResolvedTicket) {
      pendingSurveyData = await ClientSurveyResponse.findOne({
        where: {
          ticket_id: latestResolvedTicket.id,
          client_id,
          status: "Pending",
          completed_date: null,
        },
        transaction,
      });

      hasPendingSurvey = !!pendingSurveyData;
    }

    // if client has pending survey, block ticket creation
    if (hasPendingSurvey) {
      await transaction.rollback();

      const latestTicketService = await Service.findByPk(
        latestResolvedTicket.service_id,
        { attributes: ["name"] },
      );

      return res.status(403).json({
        success: false,
        message:
          "Cannot create new ticket. Please complete the survey for your previous resolved ticket first.",
        error: "SURVEY_PENDING",
        details: {
          pendingSurvey: {
            ticket_id: latestResolvedTicket.id,
            ticket_code: latestResolvedTicket.ticket_code,
            resolved_date: latestResolvedTicket.updatedAt,
            service_name: latestTicketService?.name || "Unknown service",
            service_id: latestResolvedTicket.service_id,
          },
          instructions:
            "Complete the survey for your previous ticket to request new services.",
        },
      });
    }

    const finalStatus = is_online ? "Unapproved" : "In Queue";
    // create ticket if no pending survey
    const ticket = await Ticket.create(
      {
        service_id,
        status: finalStatus,
        details,
        client_id,
        scheduled_date: scheduled_date || null,
        confirmation_date: confirmation_date || null,
        is_online,
      },
      { transaction },
    );

    const createdTicketWithRelations = await Ticket.findOne({
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["name"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["id", "name", "department_code"],
            },
          ],
        },
      ],
      where: {
        id: ticket.id,
      },
      transaction,
    });

    await transaction.commit();

    if (is_online) {
      try {
        // send email
        if (createdTicketWithRelations.client?.email) {
          await sendEmail({
            to: createdTicketWithRelations.client?.email,
            subject: "Your SDO ticket request has been received!",
            html: ticketCreatedEmailTemplate({
              customerName:
                createdTicketWithRelations.client?.first_name || "there",
              ticketCode: ticket.ticket_code,
              serviceName: createdTicketWithRelations.service?.name || "N/A",
              departmentName:
                createdTicketWithRelations.service?.department?.name || "N/A",
            }),
          });
        }
      } catch (emailError) {
        console.error("Ticket created but email failed:", emailError);
      }
    } else {
      // update the queue realtime if ticket is created onsite
      await emitQueueUpdate(
        req,
        createdTicketWithRelations.service?.department?.id,
      );
    }

    res.status(201).json({
      success: true,
      message: "Ticket created successfully!",
      ticket: createdTicketWithRelations,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating ticket:", err);

    if (err.message === "SURVEY_PENDING") {
      return res.status(403).json({
        success: false,
        message:
          "Cannot create new ticket. Please complete the survey for your previous resolved ticket first.",
        error: "SURVEY_PENDING",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while creating the ticket.",
      error: err.message,
    });
  }
};

export const updateTicketStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id, status } = req.body;

    if (!id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    if (!status) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "In Queue",
      "Ongoing",
      "Resolved",
      "On hold",
      "Unapproved",
      "Declined",
    ];
    if (!allowedStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["department_id"],
        },
      ],
      transaction,
    });

    if (!ticket) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const departmentId = ticket.service.department_id;
    const updatedTicketData = { status };

    // custom function for each available ticket status
    const statusHandler = statusHandlers[status];
    if (statusHandler) {
      await statusHandler(ticket, updatedTicketData, transaction);
    }

    const [updatedCount] = await Ticket.update(updatedTicketData, {
      where: { id },
      transaction,
    });

    if (updatedCount === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Ticket not found or no changes made",
      });
    }

    await transaction.commit();

    // Emit socket event AFTER successful commit
    await emitQueueUpdate(req, departmentId);

    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["name", "department_id"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["name", "department_code"],
            },
          ],
        },
      ],
    });

    // custom email templates for each ticket status
    const sendEmailBasedOnStatus =
      sendEmailBasedOnTicketStatus[updatedTicket.status];
    if (sendEmailBasedOnStatus) {
      await sendEmailBasedOnStatus(updatedTicket);
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully!",
      data: updatedTicket,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating ticket:", err);

    res.status(500).json({
      success: false,
      message: "An error occurred while updating the ticket status.",
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
