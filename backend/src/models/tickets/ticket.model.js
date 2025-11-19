import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";
import { Service, TicketCounter, Department } from "../index.js";

const Ticket = sequelize.define("ticket", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ticket_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.CHAR,
  },
  // title: {
  //   type: DataTypes.STRING,
  // },
  details: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  scheduled_date: {
    type: DataTypes.DATE,
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  client_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  assignee_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
  },
  service_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
});

// hook for generating ticket_code
Ticket.beforeCreate(async (ticket, options) => {
  const transaction = options.transaction;

  // Get service + department
  const service = await Service.findByPk(ticket.service_id, {
    include: [{ model: Department }],
    transaction,
  });

  if (!service || !service.department) {
    throw new Error("Invalid service_id – department not found.");
  }

  const deptId = service.department.id;
  const deptCode = service.department.department_code; // e.g. "IT"

  // Lock the counter row for this department
  let counter = await TicketCounter.findOne({
    where: { department_id: deptId },
    transaction,
    lock: transaction.LOCK.UPDATE, // prevents race conditions
  });

  if (!counter) {
    counter = await TicketCounter.create(
      { department_id: deptId, next_number: 1 },
      { transaction }
    );
  }

  // Generate ticket_code using the current counter
  const ticketNumber = counter.next_number;
  ticket.ticket_code = `${deptCode}-${String(ticketNumber).padStart(5, "0")}`;

  // Increment counter for next time
  counter.next_number += 1;
  await counter.save({ transaction });
});

export default Ticket;
