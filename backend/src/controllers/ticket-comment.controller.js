import {
  Ticket,
  Service,
  Department,
  User,
  TicketComment,
  TicketView,
  Role,
} from "../models/index.js";
import sequelize from "../configs/sequelize.config.js";
import { Op, Sequelize } from "sequelize";

export const getCommentsByTicket = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Check if ticket exists
    const ticket = await Ticket.findByPk(ticketID);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Get total count for pagination info
    const totalCount = await TicketComment.count({
      where: { ticket_id: ticketID },
    });

    // Get paginated comments
    const comments = await TicketComment.findAll({
      where: { ticket_id: ticketID },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Role,
              as: "role",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalComments: totalCount,
          hasMore: page * limit < totalCount,
          nextPage: page * limit < totalCount ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const { content } = req.body;
    const userID = req.user.id;

    // Validate input
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Check if ticket exists
    const ticket = await Ticket.findByPk(ticketID);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Create comment
    const comment = await TicketComment.create({
      content: content.trim(),
      ticket_id: ticketID,
      user_id: userID,
    });

    // Fetch comment with user data
    const commentWithUser = await TicketComment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: commentWithUser,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
          (comment) => comment.user_id !== user.id,
        );
        const userView = ticket.views?.[0];

        let newCommentCount = 0;

        if (userView && userView.last_comment_seen_id) {
          const lastSeenIndex = otherUserComments.findIndex(
            (comment) => comment.id === userView.last_comment_seen_id,
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
      (comment) => comment.user_id !== userID,
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
      })),
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
      (comment) => comment.user_id !== userID,
    );

    const userView = ticket.views?.[0];

    let newCommentCount = 0;
    let hasNewComments = false;

    if (otherUserComments.length > 0) {
      if (userView && userView.last_comment_seen_id) {
        const lastSeenIndex = otherUserComments.findIndex(
          (comment) => comment.id === userView.last_comment_seen_id,
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
