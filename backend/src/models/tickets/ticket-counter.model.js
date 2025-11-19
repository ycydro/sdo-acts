import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const TicketCounter = sequelize.define("ticket_counter", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  department_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  next_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

export default TicketCounter;
