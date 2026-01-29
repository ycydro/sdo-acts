import sequelize from "../configs/sequelize.config.js";
import {
  Ticket,
  Service,
  Department,
  User,
  QueueSession,
} from "../models/index.js";
import getLocalDateString from "../helpers/getLocalDateString.js";
import { Op } from "sequelize";

export const getQueuedTicketsByDepartment = async (req, res) => {
  try {
    const { department_id } = req.query;
    const user = req.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const whereConditions = {
      status: "In Queue",
      scheduled_date: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    };

    // Filter by department
    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    } else if (department_id) {
      whereConditions["$service.department_id$"] = department_id;
    }

    const tickets = await Ticket.findAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["name", "processing_time_in_minutes"],
          include: [
            {
              model: Department,
              attributes: ["id", "name", "department_code"],
            },
          ],
        },
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [
        ["confirmation_date", "ASC"],
        ["scheduled_date", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Group tickets by department
    const ticketsByDepartment = {};

    tickets.forEach((ticket) => {
      const deptCode = ticket.service.department.department_code;
      if (!ticketsByDepartment[deptCode]) {
        ticketsByDepartment[deptCode] = {
          department: ticket.service.department,
          tickets: [],
        };
      }
      ticketsByDepartment[deptCode].tickets.push(ticket);
    });

    return res.status(200).json({
      success: true,
      data: ticketsByDepartment,
      message: "Queued tickets fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch queued tickets.",
      error: error.message,
    });
  }
};

export const getAllDepartmentsQueue = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessionDate = getLocalDateString(today);

    // Fetch all active departments
    const departments = await Department.findAll({
      where: { status: "active" },
      attributes: ["id", "name", "department_code"],
    });

    // Build queue data for each department
    const queueByDepartment = {};

    for (const dept of departments) {
      // Fetch queued tickets for this department
      const queuedTickets = await Ticket.findAll({
        where: {
          status: "In Queue",
          scheduled_date: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
          "$service.department_id$": dept.id,
        },
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["name", "processing_time_in_minutes"],
            include: [
              {
                model: Department,
                attributes: ["id", "name", "department_code"],
              },
            ],
          },
          {
            model: User,
            as: "client",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
        order: [
          ["confirmation_date", "ASC"],
          ["scheduled_date", "ASC"],
          ["createdAt", "ASC"],
        ],
      });

      // Fetch queue session for this department
      const queueSession = await QueueSession.findOne({
        where: {
          department_id: dept.id,
          session_date: sessionDate,
        },
        raw: true, // Get raw data
      });

      let sessionData = null;
      if (queueSession) {
        sessionData = {
          is_active: Boolean(queueSession.is_active), // force boolean conversion
          current_serving_ticket_id: queueSession.current_serving_ticket_id,
        };
      } else {
        sessionData = {
          is_active: false,
          current_serving_ticket_id: null,
        };
      }

      // Store data using department_code as key
      queueByDepartment[dept.department_code] = {
        department: {
          id: dept.id,
          name: dept.name,
          department_code: dept.department_code,
        },
        queuedTickets: queuedTickets,
        queueSession: sessionData,
      };
    }

    return res.status(200).json({
      success: true,
      data: queueByDepartment,
      message: "All departments queue data fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch queue data.",
      error: error.message,
    });
  }
};

// Get current queue session for a department
export const getQueueSessionByDepartment = async (req, res) => {
  try {
    const { department_id } = req.query;
    const user = req.user;

    const departmentId = user.department_id || department_id;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    // Get today's date
    const today = new Date();
    const sessionDate = getLocalDateString(today);

    let session = await QueueSession.findOne({
      where: {
        department_id: departmentId,
        session_date: sessionDate,
      },
      include: [
        {
          model: Ticket,
          as: "currentServingTicket",
          required: false,
          include: [
            {
              model: Service,
              as: "service",
              attributes: ["name"],
            },
            {
              model: User,
              as: "client",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        },
        {
          model: User,
          as: "startedBy",
          required: false,
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });

    // If no session exists for today, return default inactive state
    if (!session) {
      return res.status(200).json({
        success: true,
        data: {
          is_active: false,
          current_serving_ticket_id: null,
          currentServingTicket: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching queue session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch queue session",
      error: error.message,
    });
  }
};

// Update queue session
export const updateQueueSession = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { department_id, is_active, current_serving_ticket_id } = req.body;
    const user = req.user;

    const departmentId = user.department_id || department_id;
    const userId = user.id;

    if (!departmentId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const today = new Date();
    const sessionDate = today.toISOString().split("T")[0];

    // Find or create session for today
    let session = await QueueSession.findOne({
      where: {
        department_id: departmentId,
        session_date: sessionDate,
      },
      transaction,
    });

    if (!session) {
      // Create new session
      session = await QueueSession.create(
        {
          department_id: departmentId,
          is_active: is_active,
          current_serving_ticket_id: current_serving_ticket_id || null,
          started_by_user_id: is_active ? userId : null,
          started_at: is_active ? new Date() : null,
          session_date: sessionDate,
        },
        { transaction },
      );
    } else {
      // Update existing session
      await session.update(
        {
          is_active: is_active,
          current_serving_ticket_id: current_serving_ticket_id || null,
          started_by_user_id: is_active ? userId : session.started_by_user_id,
          started_at:
            is_active && !session.started_at ? new Date() : session.started_at,
        },
        { transaction },
      );
    }

    await transaction.commit();

    // Fetch updated session with relations
    const updatedSession = await QueueSession.findOne({
      where: { id: session.id },
      include: [
        {
          model: Ticket,
          as: "currentServingTicket",
          required: false,
          include: [
            {
              model: Service,
              as: "service",
              attributes: ["name"],
            },
            {
              model: User,
              as: "client",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        },
      ],
    });

    // Emit socket event for real-time updates
    await emitQueueStateUpdate(req, departmentId, {
      is_active: updatedSession.is_active,
      current_serving_ticket_id: updatedSession.current_serving_ticket_id,
      currentServingTicket: updatedSession.currentServingTicket,
    });

    return res.status(200).json({
      success: true,
      message: "Queue session updated successfully",
      data: updatedSession,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating queue session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update queue session",
      error: error.message,
    });
  }
};

// emit queue state updates via socket
const emitQueueStateUpdate = async (req, departmentId, queueState) => {
  const io = req.app.get("io");
  if (!io) return;

  try {
    const stateData = {
      departmentId,
      isActive: queueState.is_active,
      currentServingTicketId: queueState.current_serving_ticket_id,
      currentServingTicket: queueState.currentServingTicket,
      timestamp: new Date().toISOString(),
    };

    // Emit to department room
    io.to(`department-${departmentId}`).emit("queue-state-updated", stateData);

    // Emit to all departments room (for monitors)
    io.to("all-departments").emit("queue-state-updated", stateData);

    console.log(`✅ Queue state update emitted for department ${departmentId}`);
  } catch (error) {
    console.error("Error emitting queue state update:", error);
  }
};

const emitQueueUpdate = async (req, departmentId) => {
  const io = req.app.get("io");
  if (!io) return;

  try {
    // Fetch updated queue for the department
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queuedTickets = await Ticket.findAll({
      where: {
        status: "In Queue",
        scheduled_date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        "$service.department_id$": departmentId,
      },
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["name", "processing_time_in_minutes"],
          include: [
            {
              model: Department,
              attributes: ["id", "name", "department_code"],
            },
          ],
        },
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [
        ["confirmation_date", "ASC"],
        ["scheduled_date", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    const departmentCode =
      queuedTickets[0]?.service?.department?.department_code || "N/A";

    // Emit to specific department room
    io.to(`department-${departmentId}`).emit("queue-updated", {
      departmentId,
      departmentCode,
      queuedTickets,
      servingTicket: queuedTickets[0],
    });

    // Emit to all departments room (for the queue display monitor)
    io.to("all-departments").emit("queue-updated", {
      departmentId,
      departmentCode,
      queuedTickets,
      servingTicket: queuedTickets[0],
    });

    console.log(`✅ Queue update emitted for department ${departmentId}`);
  } catch (error) {
    console.error("Error emitting queue update:", error);
  }
};

export { emitQueueUpdate };
