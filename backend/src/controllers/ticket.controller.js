import sequelize from "../configs/sequelize.config.js";

import {
  Ticket,
  Service,
  Department,
  User,
  TicketComment,
  TicketView,
  ClientSurveyResponse,
} from "../models/index.js";
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
        // priority first
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
        [
          Sequelize.literal(`
            CASE 
              WHEN \`ticket\`.\`status\` = 'Ongoing' THEN 1
              WHEN \`ticket\`.\`status\` = 'Resolved' THEN 2
              ELSE 0
            END
          `),
          "ASC",
        ],
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
          [Op.ne]: "Resolved",
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
    const { service_id, details, client_id, scheduled_date, is_online } =
      req.body;

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
        { attributes: ["name"] }
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

    // create ticket if no pending survey
    const ticket = await Ticket.create(
      {
        service_id,
        status: "In Queue",
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
      ticket,
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

    const allowedStatuses = ["In Queue", "Ongoing", "Resolved", "On hold"];
    if (!allowedStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const ticket = await Ticket.findByPk(id, { transaction });

    if (!ticket) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updatedTicketData = { status };

    // add start_date if status is being changed to 'Ongoing'
    if (status === "Ongoing" && ticket.status === "In Queue") {
      updatedTicketData.start_date = new Date();
    }

    // add end_date if status is being changed to 'Resolved'
    if (status === "Resolved" && ticket.status !== "Resolved") {
      updatedTicketData.end_date = new Date();
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

    if (status === "Resolved") {
      const existingSurvey = await ClientSurveyResponse.findOne({
        where: { ticket_id: id },
        transaction,
      });

      if (!existingSurvey) {
        await ClientSurveyResponse.create(
          {
            client_id: ticket.client_id,
            ticket_id: id,
            survey_date: new Date(),
            status: "Pending",
            overall_rating: null,
            total_score: null,
            comments: null,
          },
          { transaction }
        );

        console.log(`Created unanswered survey for ticket ${id}`);
      } else {
        console.log(`Survey already exists for ticket ${id}`);
      }

      // TODO: SEND EMAIL
    }

    await transaction.commit();

    const updatedTicket = await Ticket.findByPk(id);

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

export const getTicketsWithNewComments = async (req, res) => {
  try {
    const user = req.user;

    const whereConditions = {
      [Op.and]: [
        sequelize.literal(`
          EXISTS (
            SELECT 1 FROM ticket_comments tc
            WHERE tc.ticket_id = ticket.id
            AND tc.user_id != '${user.id}'
            AND (
              NOT EXISTS (
                SELECT 1 FROM ticket_views tv
                WHERE tv.ticket_id = ticket.id
                AND tv.user_id = '${user.id}'
                AND tv.last_comment_seen_id = tc.id
              )
            )
          )
        `),
      ],
    };

    if (user.department_id) {
      whereConditions[Op.and].push({
        "$service.department_id$": user.department_id,
      });
    }

    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name"],
        },
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
          model: TicketComment,
          as: "comments",
          required: false,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
          separate: true,
          order: [["createdAt", "DESC"]],
        },
        {
          model: TicketView,
          as: "views",
          where: { user_id: user.id },
          required: false,
        },
      ],
      where: whereConditions,
      order: [["createdAt", "ASC"]],
    });

    const processedTickets = tickets
      .map((ticket) => {
        const comments = ticket.comments || [];
        const otherUserComments = comments.filter(
          (comment) => comment.user_id !== user.id
        );
        const userView = ticket.views?.[0];

        let newCommentCount = 0;

        if (userView && userView.last_comment_seen_id) {
          const lastSeenIndex = otherUserComments.findIndex(
            (comment) => comment.id === userView.last_comment_seen_id
          );
          newCommentCount =
            lastSeenIndex === -1 ? otherUserComments.length : lastSeenIndex;
        } else {
          newCommentCount = otherUserComments.length;
        }

        return {
          ...ticket.toJSON(),
          hasNewComments: newCommentCount > 0,
          newCommentCount,
          latestComment: otherUserComments[0] || null,
        };
      })
      .filter((ticket) => ticket.hasNewComments);

    res.json({
      success: true,
      data: processedTickets,
      count: processedTickets.length,
    });
  } catch (error) {
    console.error("Error fetching tickets with new comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets with new comments",
      error: error.message,
    });
  }
};

export const markTicketCommentsAsSeen = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const userID = req.user.id;

    // Find the ticket with comments in separate query
    const ticket = await Ticket.findByPk(ticketID, {
      include: [
        {
          model: TicketComment,
          as: "comments",
          separate: true,
          order: [["createdAt", "DESC"]], // Newest first
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Get the latest comment ID (if any comments exist)
    const otherUserComments = ticket?.comments.filter(
      (comment) => comment.user_id !== userID
    );

    const latestCommentId =
      otherUserComments.length > 0 ? otherUserComments[0].id : null;

    console.log("Latest comment ID:", latestCommentId);
    console.log(
      "All comments:",
      otherUserComments.map((c) => ({
        id: c.id,
        createdAt: c.createdAt,
        content: c.content,
      }))
    );

    // Check if user already has a view record for this ticket
    const existingView = await TicketView.findOne({
      where: {
        ticket_id: ticketID,
        user_id: userID,
      },
    });

    if (existingView) {
      // Update existing view record
      await existingView.update({
        last_viewed_at: new Date(),
        last_comment_seen_id: latestCommentId,
      });
    } else {
      // Create new view record
      await TicketView.create({
        ticket_id: ticketID,
        user_id: userID,
        last_viewed_at: new Date(),
        last_comment_seen_id: latestCommentId,
      });
    }

    res.json({
      success: true,
      message: "Comments marked as seen",
      data: {
        ticketID,
        lastViewedAt: new Date(),
        lastCommentSeenId: latestCommentId,
      },
    });
  } catch (error) {
    console.error("Error marking comments as seen:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark comments as seen",
      error: error.message,
    });
  }
};

export const markMultipleTicketsCommentsAsSeen = async (req, res) => {
  try {
    const { ticketIDs } = req.body;
    const userID = req.user.id;

    if (!ticketIDs || !Array.isArray(ticketIDs)) {
      return res.status(400).json({
        success: false,
        message: "ticketIDs array is required",
      });
    }

    const results = [];

    for (const ticketId of ticketIDs) {
      try {
        // Get the latest comment for this specific ticket
        const latestComment = await TicketComment.findOne({
          where: { ticket_id: ticketId },
          order: [["createdAt", "DESC"]],
        });

        const latestCommentId = latestComment ? latestComment.id : null;

        // Update or create the view record
        const [viewRecord, created] = await TicketView.findOrCreate({
          where: {
            ticket_id: ticketId,
            user_id: userID,
          },
          defaults: {
            last_viewed_at: new Date(),
            last_comment_seen_id: latestCommentId,
          },
        });

        if (!created) {
          await viewRecord.update({
            last_viewed_at: new Date(),
            last_comment_seen_id: latestCommentId,
          });
        }

        results.push({
          ticketID: ticketId,
          lastViewedAt: new Date(),
          lastCommentSeenId: latestCommentId,
        });
      } catch (error) {
        console.error(`Error processing ticket ${ticketId}:`, error);
      }
    }

    res.json({
      success: true,
      message: `${results.length} of ${ticketIDs.length} ticket(s) marked as seen`,
      data: results,
    });
  } catch (error) {
    console.error("Error marking multiple tickets as seen:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark tickets as seen",
      error: error.message,
    });
  }
};

export const checkTicketHasNewComments = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const userID = req.user.id;

    const ticket = await Ticket.findByPk(ticketID, {
      include: [
        {
          model: TicketComment,
          as: "comments",
          required: false,
          separate: true,
          order: [["createdAt", "DESC"]],
        },
        {
          model: TicketView,
          as: "views",
          where: { user_id: userID },
          required: false,
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const allComments = ticket.comments || [];

    const otherUserComments = allComments.filter(
      (comment) => comment.user_id !== userID
    );

    const userView = ticket.views?.[0];

    let newCommentCount = 0;
    let hasNewComments = false;

    if (otherUserComments.length > 0) {
      if (userView && userView.last_comment_seen_id) {
        const lastSeenIndex = otherUserComments.findIndex(
          (comment) => comment.id === userView.last_comment_seen_id
        );

        if (lastSeenIndex === -1) {
          newCommentCount = otherUserComments.length;
        } else if (lastSeenIndex > 0) {
          // Count comments before the last seen one
          newCommentCount = lastSeenIndex;
        }
      } else {
        // No view record exists for this user
        newCommentCount = otherUserComments.length;
      }

      hasNewComments = newCommentCount > 0;
    }

    res.json({
      success: true,
      data: {
        ticketID,
        hasNewComments,
        newCommentCount,
        totalComments: allComments.length,
        otherUserCommentsCount: otherUserComments.length,
        lastSeenAt: userView?.last_viewed_at || null,
        lastCommentSeenId: userView?.last_comment_seen_id || null,
        latestComment: otherUserComments[0] || null,
      },
    });
  } catch (error) {
    console.error("Error checking for new comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check for new comments",
      error: error.message,
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
