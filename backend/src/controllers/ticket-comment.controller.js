import { TicketComment, User, Ticket } from "../models/index.js";

export const getCommentsByTicket = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
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
